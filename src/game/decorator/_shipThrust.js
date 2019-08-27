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

  // register update functions
  obj.addUpdate('updateForceByThrustValue', 11);
  obj.addUpdate('updateMaxSpeedByThrustValue', 10);
  obj.addUpdate('calculateSpeed', 100, 10);
  obj.addUpdate('setAngularThrust', 13);

  perf.stop('_shipThrust.add');
}

// more thrust eq more force (eq more speed)
const metersPerSecondAcceleration = 8; // how fast to accelerate
function updateForceByThrustValue() { perf.start('_shipThrust.obj.updateForceByThrustValue');
  // thrustValue is up to 100.
  this.thrustForce = (this.thrustValue / 100) * this.mass * metersPerSecondAcceleration; // can be negative if reversing
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

  // manage speed angular speed
  if (this.dTurn > 0) {
    /* formula for distance = 1/2 (speed)(time^2) */
    if (this.dTurn > .5 * this.aS * 4 /* 6.25 = 2 ^ 2 */) {
      // normal accel should take 2 seconds to reach aSMax
      this.aA = this.aSMax / 2;
    } else {
      // decelerate until dTurn is reached
      this.aA = -this.aSMax / 2;
      // stop decelerating when aS reaches .5
      if (this.aS <= 1) this.aA = 0;
    }
  } else {
    /* formula for distance = 1/2 (speed)(time^2) */
    if (this.dTurn < .5 * this.aS * 4 /* 4 = 2 ^ 2 */) {
      // normal accel should take 2 seconds to reach aSMax
      this.aA = -this.aSMax / 2;
    } else {
      // decelerate until dTurn is reached
      this.aA = this.aSMax / 2;
      // stop decelerating when aS reaches -.5
      if (this.aS >= -1) this.aA = 0;
    }
  }

  // apply acc to aSpeed
  if (this.dTurn > 0) {
    this.aS += this.aA * elapsed;
    // enforce maximum
    if (this.aS > this.aSMax) this.aS = this.aSMax;
  } else {
    this.aS += this.aA * elapsed;
    // enforce maximum
    if (this.aS < -this.aSMax) this.aS = -this.aSMax;
  }

  if (  // stop turning if dTurn gets within .25 of dTarget;
    Math.abs(this.aS) <= 1 // only do this if approaching at slow speed
    && Math.abs(this.d - this.dTarget) < .15
  ) {
      this.set('dTurn', 0);
      this.d = this.dTarget;
      this.aA = 0;
  }

  // take away from dTurn what has transpired
  this.set('dTurn', this.dTurn - this.aS * elapsed)

  perf.stop('_shipThrust.obj.setAngularThrust');
}

export default { add, getProperties };
