// translates ship settings (throttle, energy settings, into physics outputs)
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import { cloneDeep } from 'lodash';

const temp = {}; // memory pointer to avoid allocation for new variables
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  thrustForce: 0, // in Newtons, for accelerating ship
  thrustValue: 0, // position of thruster slider. (-25 --> 100)
  thrustPercent: 0, // DERIVED from thrust force and thrust value
  dTurn: 0, // where the ship *wants* to go +/- from current
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_shipThrust.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions to obj
  obj.updateForceByThrustValue = updateForceByThrustValue;
  obj.updateMaxSpeedByThrustValue = updateMaxSpeedByThrustValue;
  obj.calculateSpeed = calculateSpeed;
  obj.setAngularThrust = setAngularThrust;
  obj.updateThrustParticles = updateThrustParticles;
  obj.updateForwardThrustParticles = updateForwardThrustParticles;
  obj.updateBackwardThrustParticles = updateBackwardThrustParticles;
  obj.updateAngularThrustParticles = updateAngularThrustParticles;


  // register update functions
  obj.addUpdate('updateForceByThrustValue', 11);
  obj.addUpdate('updateMaxSpeedByThrustValue', 10);
  obj.addUpdate('calculateSpeed', 100, 10);
  obj.addUpdate('setAngularThrust', 13);
  obj.addUpdate('updateThrustParticles', 100, 2);

  perf.stop('_shipThrust.add');
}

// more thrust eq more force (eq more speed)
const metersPerSecondAcceleration = 8; // how fast to accelerate
function updateForceByThrustValue() { perf.start('_shipThrust.obj.updateForceByThrustValue');
  // thrustValue is up to 100.
  this.thrustPercent = (this.thrustValue / 100);
  this.thrustForce = this.thrustPercent * this.mass * metersPerSecondAcceleration; // can be negative if reversing
  // adjust for direction
  this.forceY = this.dY * this.thrustForce;
  this.forceX = this.dX * this.thrustForce;

  // shut off force if past sMax
  if (this.sMaxX > 0 && this.sX > this.sMaxX) this.forceX = 0;
  if (this.sMaxX < 0 && this.sX < this.sMaxX) this.forceX = 0;
  if (this.sMaxY > 0 && this.sY > this.sMaxY) this.forceY = 0;
  if (this.sMaxY < 0 && this.sY < this.sMaxY) this.forceY = 0;

  perf.stop('_shipThrust.obj.updateForceByThrustValue');
};

// cap max speed by thrust value
function updateMaxSpeedByThrustValue() { perf.start('_shipThrust.obj.updateMaxSpeedByThrustValue');
  // max speed is 20% - 100% depending on thrustValue 0-100
  this.temp.thrustMaxSpeedRatio = Math.abs(this.thrustValue / 100) * 0.8; // max is .8
  this.temp.thrustMaxSpeedRatio += 0.2; // now its 20%-100%
  this.sMax = this.sMaxShip * this.temp.thrustMaxSpeedRatio;

  this.sMaxX = this.sMax * this.dX;
  this.sMaxY = this.sMax * this.dY;

  // when in reverse...
  if (this.thrustForce < 0) {
    this.sMaxX = this.sMaxX * -1;
    this.sMaxY = this.sMaxY * -1;
  }

  // otherwise, sMax stuck at 8 when no thrust.
  if (this.thrustForce === 0) this.sMax = 0;

  perf.stop('_shipThrust.obj.updateMaxSpeedByThrustValue');
}

// a readout of speed. Based on direction
function calculateSpeed(elapsed) { perf.start('_shipThrust.obj.calculateSpeed');
  this.temp.sXRatio = this.dX * this.sX;
  this.temp.sYRatio = this.dY * this.sY;

  this.s = this.temp.sXRatio + this.temp.sYRatio;

  perf.stop('_shipThrust.obj.calculateSpeed');
};

function setAngularThrust(elapsed) { perf.start('_shipThrust.obj.setAngularThrust');
  // TODO: this is all pretty shite. Respond to angular speed only and leave ship systems & limits out of it
  if (this.dTurn === 0) { // no direction change
    return perf.stop('_shipThrust.obj.setAngularThrust');
  }

  // see what the desired aS is and apply acceleration until we get there
  temp.isPositive = (this.dTurn >= 0) ? 1 : -1;
  if (Math.abs(this.dTurn) > this.aSMax * 1.5) { // start slowing down 1.5 seconds away from dTarget
    temp.aSDesired = this.aSMax * temp.isPositive;
  } else {
    temp.aSDesired = this.aSMax / 2 * temp.isPositive;
    if (Math.abs(this.dTurn) < 7) {
      temp.aSDesired = 2 * temp.isPositive;
    }
  }

  if (this.aS > temp.aSDesired) this.aA = this.aSMax / -2;
  if (this.aS < temp.aSDesired) this.aA = this.aSMax / 2;

  // apply aA to aS
  this.aS += this.aA * elapsed;
  if (this.aS < -this.aSMax) this.aS = -this.aSMax;
  if (this.aS > this.aSMax) this.aS = this.aSMax;

  // take away from dTurn what has transpired
  this.set('dTurn', this.dTurn - this.aS * elapsed);

  if (  // stop turning if dTurn gets within .25 of dTarget;
    Math.abs(this.aS) <= 2 // only do this if approaching at slow speed
    && Math.abs(this.d - this.dTarget) < .25
  ) {
      this.set('dTurn', 0);
      this.d = this.dTarget;
      this.aS = 0;
      this.aA = 0;
  }

  perf.stop('_shipThrust.obj.setAngularThrust');
}

function updateThrustParticles() { perf.start('_shipThrust.updateThrustParticles');
  if (this.thrustForce > 0) this.updateForwardThrustParticles();
  if (this.thrustForce < 0) this.updateBackwardThrustParticles();
  if (this.aA !== 0) this.updateAngularThrustParticles();
  perf.stop('_shipThrust.updateThrustParticles');
}

function updateForwardThrustParticles() { perf.start('_shipThrust.updateForwardThrustParticles');
  this.thrusters.forward.map((thruster) => {
    temp.particle = $g.bank.particles.pop();

    temp.distX = thruster.x / 100 * this.length;
    temp.distY = -thruster.y / 100 * this.length;

    // alt calculations based on myShip, because of perspective
    if (this.id === $g.game.myShip.id) {
      temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
      temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
      temp.distX = temp.distXPrime;
      temp.distY = temp.distYPrime;
    }

    // calc particle travel
    temp.animateFrames = Math.ceil((15 * Math.abs(this.thrustPercent)) + 5); // 5-20

    // calc particle size
    temp.length = this.size / 2;
    temp.length = temp.length / (Math.abs(this.thrustPercent) + 1);

    temp.particle.init({
      mX: this.mX + temp.distX,
      mY: this.mY - temp.distY,
      d: this.d - 180,
      c: 'rgba(147,230,255,1)',
      sMax: 120,
      animateFrames: temp.animateFrames,
      length: 10,
      type: 1
    });
  });
  perf.stop('_shipThrust.updateForwardThrustParticles');
}

function updateBackwardThrustParticles() { perf.start('_shipThrust.updateBackwardThrustParticles');
  this.thrusters.backward.map((thruster) => {
    temp.particle = $g.bank.particles.pop();

    temp.distX = thruster.x / 100 * this.length;
    temp.distY = -thruster.y / 100 * this.length;

    // alt calculations based on myShip, because of perspective
    if (this.id === $g.game.myShip.id) {
      temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
      temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
      temp.distX = temp.distXPrime;
      temp.distY = temp.distYPrime;
    }

    // calc particle travel
    temp.animateFrames = Math.ceil((15 * Math.abs(this.thrustPercent)) + 5); // 5-20

    // calc particle size
    temp.length = this.size / 2;
    temp.length = temp.length / (Math.abs(this.thrustPercent) + 1);

    temp.particle.init({
      mX: this.mX + temp.distX,
      mY: this.mY - temp.distY,
      d: this.d,
      c: 'rgba(147,230,255,1)',
      sMax: 120,
      animateFrames: temp.animateFrames,
      length: 10,
      type: 1
    });
  });
  perf.stop('_shipThrust.updateBackwardThrustParticles');
}

function updateAngularThrustParticles() { perf.start('_shipThrust.updateAngularThrustParticles');
  temp.thrusters = [];
  temp.aAPercent = Math.abs(this.aA / (this.aSMaxShip / 2));
  if (this.aA > 0) {
    temp.thrusters.push(this.thrusters.leftForward); // left first. there's a reason later for this
    temp.thrusters.push(this.thrusters.rightBackward); // right second. there's a reason later for this
  } else {
    temp.thrusters.push(this.thrusters.leftBackward); // left first. there's a reason later for this
    temp.thrusters.push(this.thrusters.rightForward); // right second. there's a reason later for this
  }
  temp.thrusters.map((thruster, i) => {
    temp.particle = $g.bank.particles.pop();

    temp.distX = thruster.x / 100 * this.length;
    temp.distY = -thruster.y / 100 * this.length;

    // alt calculations based on myShip, because of perspective
    if (this.id === $g.game.myShip.id) {
      temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
      temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
      temp.distX = temp.distXPrime;
      temp.distY = temp.distYPrime;
    }

    // calc particle travel
    temp.animateFrames = Math.ceil((5 * Math.abs(temp.aAPercent)) + 3); // 2-7

    // calc particle size
    temp.length = this.size / 4;
    temp.length = temp.length / (Math.abs(temp.aAPercent) + 1);

    temp.particle.init({
      mX: this.mX + temp.distX,
      mY: this.mY - temp.distY,
      d: this.d + ((i == 0) ? -90 : 90),
      c: 'rgba(147,230,255,1)',
      sMax: 100,
      animateFrames: temp.animateFrames,
      length: 10,
      type: 1
    });
  });
  perf.stop('_shipThrust.updateAngularThrustParticles');
}


export default { add, getProperties };
