import maths from '../../utils/maths.js';
import globals from '../../utils/globals.js';
import perf from '../../utils/perf.js';
import { cloneDeep } from 'lodash';

const temp = {};
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  // PHYSICAL
  mass: 1000, // in Kg
  mXLast: -1,
  mYLast: -1,

  // DIRECTION
  d: 0, // in degrees, cardinal 0 is up. 359.9 is almost up
  dLast: -1.1, // differnt from d to trigger update
  // calculated by obj.d updating
  dX: 0, // unit circle (-1 -> 1) value based on degrees. e.g. {d:0, dX:0} {d:90, dX: 1} {d:45, dX: 1/SQRT2}
  dY: 0, // unit circle (-1 -> 1) value based on degrees. e.g. {d:0, dY:1} {d:90, dY: 0} {d:45, dY: 1/SQRT2}
  // TODO: move these to thrust?
  aS: 0, // angle per second
  aSMax: 0, // angle per second limits
  aA: 0, // angle per second accleration

  // SPEED
  sX: 0, // x-axis meters / second
  sY: 0, // y-axis meters / second
  s: 0, // CALCULATED from sX and sY. in meters / second
  // TODO move sMax stuff to shipThrust.js
  sMaxX: 0, // DERIVED from sMax * dX
  sMaxY: 0, // DERIVED from sMax * dY
  sMax: 0, // Speed cap at any given moment

  // FORCE
  forceX: 0, // Thrust force applied to X axis
  forceY: 0, // Thrust force applied to Y axis
  forceResistX: 0,
  forceResistY: 0,

  // RELATIVE TO MYSHIP
  distanceFromMyShip: 0,
  directionFromMyShip: 0,
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_physics.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties
  obj.updatePosition = updatePosition;
  obj.updateDirection = updateDirection;
  obj.updateTrig = updateTrig;
  obj.applyResistanceForce = applyResistanceForce;
  obj.updateSpeedByForce = updateSpeedByForce;
  obj.initPhysics = initPhysics;
  obj.calculateDistanceFromMyShip = calculateDistanceFromMyShip;
  obj.calculateDirectionFromMyShip = calculateDirectionFromMyShip;

  // register init function for physics
  obj.inits.push('updateTrig');

  // register update functions
  obj.addUpdate('updatePosition', 21);
  obj.addUpdate('updateDirection', 20);
  obj.addUpdate('applyResistanceForce', 12, 4);
  obj.addUpdate('updateSpeedByForce', 13, 4);
  obj.addUpdate('calculateDistanceFromMyShip', 100, 10);
  obj.addUpdate('calculateDirectionFromMyShip', 100, 12);

  perf.stop('_physics.add');
}

function updatePosition(elapsed) { perf.start('_physics.obj.updatePosition');
  // record mXLast, mYLast
  this.mXLast = this.mX;
  this.mYLast = this.mY;

  this.mX += this.sX * elapsed;
  this.mY += this.sY * elapsed;

  perf.stop('_physics.obj.updatePosition');
};

function updateDirection(elapsed) { perf.start('_physics.obj.updateDirection');
  this.dLast = this.d; // record for posterity
  // increment direction based on aS
  this.d += this.aS * elapsed;
  this.d = this.d % 360;

  if (this.dLast !== this.d) {
    this.updateTrig();
  }
  perf.stop('_physics.obj.updateDirection');
};

function calculateDistanceFromMyShip() { perf.start('_physics.obj.calculateDistanceFromMyShip');
  if (this.id !== $g.game.myShip.id) {
    this.distanceFromMyShip = maths.getDistance(this.mX, this.mY, $g.game.myShip.mX, $g.game.myShip.mY);
  }
  return perf.stop('_physics.obj.calculateDistanceFromMyShip');
}

function calculateDirectionFromMyShip() { perf.start('_physics.obj.calculateDirectionFromMyShip');
  if (this.id !== $g.game.myShip.id) {
    this.directionFromMyShip = maths.getDegree2P($g.game.myShip.mX, $g.game.myShip.mY, this.mX, this.mY);
  }
  return perf.stop('_physics.obj.calculateDirectionFromMyShip');
}

function updateTrig(elapsed) { perf.start('_physics.obj.updateTrig');
  // do the trig calculations once here
  this.dX = Math.sin(this.d * $g.constants.RADIAN);
  this.dY = Math.cos(this.d * $g.constants.RADIAN);

  perf.stop('_physics.obj.updateTrig');
};

// the faster you go, the more it resists
const resistanceMaxSpeed = 80; // m/s at which the resistance is at maximum
const resistanceMaxDecel = 12; // m/s^2 resistance at max m/s speed
const resistanceMinDecel = .5; // always supply at least 0.5 m/s of resist
function applyResistanceForce(elapsed) { perf.start('_physics.obj.applyResistanceForce');
  // always apply at least 1 m/s worth of decel
  this.temp.minResistForce = resistanceMinDecel * this.mass;

  /* as speeds increase towards 100 m/s (either axis) begin to resist by applying negative force */
  this.forceResistX = (this.sX / resistanceMaxSpeed) * resistanceMaxDecel * this.mass;
  this.forceResistY = (this.sY / resistanceMaxSpeed) * resistanceMaxDecel * this.mass;

  // apply min resist in the absence of thrust force
  if (this.forceX === 0) {
    if (this.forceResistX > 0) {
      this.forceResistX += this.temp.minResistForce;
    } else if (this.forceResist < 0) {
      this.forceResistX -= this.temp.minResistForce;
    }
  }

  if (this.forceY === 0) {
    if (this.forceResistY > 0) {
      this.forceResistY += this.temp.minResistForce;
    } else if (this.forceResist < 0) {
      this.forceResistY -= this.temp.minResistForce;
    }
  }

  perf.stop('_physics.obj.applyResistanceForce');
}

// increment speed based on force
function updateSpeedByForce(elapsed) { perf.start('_physics.obj.updateSpeedByForce');
  this.temp.netForceX = this.forceX - this.forceResistX;
  this.temp.netForceY = this.forceY - this.forceResistY;

  // precalculate the amount to increase by force
  this.temp.sXIncrease = (this.temp.netForceX * elapsed / this.mass);
  this.temp.sYIncrease = (this.temp.netForceY * elapsed / this.mass);

  // apply increase
  this.sX += this.temp.sXIncrease;
  this.sY += this.temp.sYIncrease;

  perf.stop('_physics.obj.updateSpeedByForce');
};

function initPhysics() { perf.start('_physics.obj.initPhysics');
  this.updateTrig();
  perf.stop('_physics.obj.initPhysics');
};

export default { add, getProperties };
