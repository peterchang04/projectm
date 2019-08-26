// TODO: update distance to reflect camera resolution to pixel ratio
import cardinalDirection from '../../utils/cardinalDirection.js';
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
  sMaxX: 100, // DERIVED from sMax * dX
  sMaxY: 100, // DERIVED from sMax * dY
  sMax: 100, // Speed cap at any given moment

  // FORCE
  forceX: 0, // Thrust force applied to X axis
  forceY: 0, // Thrust force applied to Y axis
  forceResistX: 0,
  forceResistY: 0,
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_physics.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties
  // TODO: Move vue hooks to own decorator
  /* Vue hook allow for callbacks to be added for triggering on change */
  obj.callbacks = {};
  obj.addOnUpdate = function(key, name, func, overwrite = false) { perf.start('_physics.obj.addOnUpdate');
    // first item? create {}
    if (!this.callbacks[key]) this.callbacks[key] = {};
    // set function if it doesn't exist already
    if (overwrite || !this.callbacks[key][name]) this.callbacks[key][name] = func;

    perf.stop('_physics.obj.addOnUpdate');
  }
  obj.set = function(key, value) { perf.start('_physics.obj.set');
    if (this[key] === value) return;
    if (this.callbacks[key]) {
      for (this.temp.name in this.callbacks[key]) {
        this.callbacks[key][this.temp.name](value, this[key], this); // (newValue, oldValue)
      }
    }
    this[key] = value;
    perf.stop('_physics.obj.set');
  };

  obj.updatePosition = function(elapsed) { perf.start('_physics.obj.updatePosition');
    // record mXLast, mYLast
    this.mXLast = this.mX;
    this.mYLast = this.mY;

    this.mX += this.sX * elapsed;
    this.mY += this.sY * elapsed;

    perf.stop('_physics.obj.updatePosition');
  };

  obj.updateDirection = function(elapsed) { perf.start('_physics.obj.updateDirection');
    this.dLast = this.d; // record for posterity
    // increment direction based on aS
    this.d += this.aS * elapsed;
    this.d = this.d % 360;
    // this.angle = maths.degreeToAngle(this.d);
    // this.radian = maths.angleToRadian(this.angle);
    this.updateTrig();
    perf.stop('_physics.obj.updateDirection');
  };

  obj.updateTrig = function(elapsed) { perf.start('_physics.obj.updateTrig');
    // do the trig calculations once here
    // TODO: performance. can mod by objectId to update trig on separate frames
    this.dX = Math.sin(this.d * $g.constants.RADIAN);
    this.dY = Math.cos(this.d * $g.constants.RADIAN);

    perf.stop('_physics.obj.updateTrig');
  };

  // the faster you go, the more it resists
  const resistanceMaxSpeed = 80; // m/s at which the resistance is at maximum
  const resistanceMaxDecel = 12; // m/s^2 resistance at max m/s speed
  const resistanceMinDecel = .5; // always supply at least 0.5 m/s of resist
  obj.applyResistanceForce = function(elapsed) { perf.start('_physics.obj.applyResistanceForce');
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
  obj.updateSpeedByForce = function (elapsed) { perf.start('_physics.obj.updateSpeedByForce');
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

  obj.initPhysics = function() {
    this.updateTrig();
  };
  obj.inits.push('updateTrig');

  // register update functions
  obj.addUpdate('updatePosition', 21);
  obj.addUpdate('updateDirection', 20);
  obj.addUpdate('applyResistanceForce', 12, 4);
  obj.addUpdate('updateSpeedByForce', 13, 4);

  perf.stop('_physics.add');
}

export default { add, getProperties };
