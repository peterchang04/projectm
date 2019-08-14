// TODO: update distance to reflect camera resolution to pixel ratio
import cardinalDirection from '../../utils/cardinalDirection.js';
import maths from '../../utils/maths.js';
import globals from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const temp = {};
function add(obj) { perf.start('_physics.add');
  // mass
  if (obj.mass === undefined) obj.mass = 1000; // in Kg

  // DIRECTION
  if (obj.x === undefined) obj.x = 150; // coordinate
  if (obj.y === undefined) obj.y = 150; // coordinate
  if (obj.d === undefined) obj.d = 0; // in degrees. cardinal 0 is up, 359.9 is almost up
  if (obj.dX === undefined) obj.dX = 0; // this is the unit circle X coordinate value based on degrees
  if (obj.dY === undefined) obj.dY = 0; // this is hte unit circle Y coordinate value based on degrees

  // SPEED
  if (obj.s === undefined) obj.s = 0; // DERIVED from sX and sY. meters / second

  if (obj.sX === undefined) obj.sX = 0; // x axis speed +/-
  if (obj.sY === undefined) obj.sY = 0; // y axis speed +/-
  if (obj.forceX === undefined) obj.forceX = 0; // force applied to X axis (thrust)
  if (obj.forceY === undefined) obj.forceY = 0; // force applied to Y axis (thrust)
  if (obj.forceResistX === undefined) obj.forceResistX = 0;
  if (obj.forceResistY === undefined) obj.forceResistY = 0;
  if (obj.sMax === undefined) obj.sMax = 100; // DERIVED from s to sX, sY ratio
  if (obj.sMaxX === undefined) obj.sMaxX = 100;
  if (obj.sMaxY === undefined) obj.sMaxY = 100;

  // angular acceleration
  if (obj.aS === undefined) obj.aS = 0; // angle / second
  if (obj.aSMax === undefined) obj.aSMax = 45; // angle / second
  if (obj.aA === undefined) obj.aA = 0; // acceleration angle / second^2
  obj.dTurn = 0; // where the ship *wants* to go +/- from current

  // computed values
  temp.lastPositionUpdate = Date.now();
  temp.lastMomentumUpdate = Date.now();
  temp.lastDirectionUpdate = Date.now();

  temp.distX = 0; // tracks the last dist update
  temp.distY = 0; // tracks the last dist update

/* allow for callbacks to be added for triggering on change */
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

  obj.updatePosition = function(elapsedSec, updateCount) { perf.start('_physics.obj.updatePosition');
    this.mX += this.sX * elapsedSec;
    this.mY += this.sY * elapsedSec;

    perf.stop('_physics.obj.updatePosition');
  };

  obj.updateDirection = function(elapsedSec, updateCount) { perf.start('_physics.obj.updateDirection');
    // TODO: this is all pretty shite. Respond to angular speed only and leave ship systems & limits out of it
    if (this.dTurn === 0) { // no direction change
      perf.stop('_physics.obj.updateDirection');
      return;
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
      this.aS += this.aA * elapsedSec;
      // enforce maximum
      if (this.aS > this.aSMax) this.aS = this.aSMax;
    } else {
      this.aS += this.aA * elapsedSec;
      // enforce maximum
      if (this.aS < -this.aSMax) this.aS = -this.aSMax;
    }

    // now increment direction
    this.d += this.aS * elapsedSec;
    // take away from dTurn what has transpired
    this.set('dTurn', this.dTurn - this.aS * elapsedSec)

    if (  // stop turning if dTurn gets within .25 of dTarget;
      Math.abs(this.aS) <= 1 // only do this if approaching at slow speed
      && Math.abs(this.d - this.dTarget) < .15
    ) {
        this.set('dTurn', 0);
        this.d = this.dTarget;
        this.aA = 0;
    }

    this.d = this.d % 360;
    this.angle = maths.degreeToAngle(this.d);
    this.radian = maths.angleToRadian(this.angle);

    perf.stop('_physics.obj.updateDirection');
  };

  obj.updateTrig = function(elapsedSec, updateCount) { perf.start('_physics.obj.updateTrig');
    // do the trig calculations once here
    // TODO: performance. can mod by objectId to update trig on separate frames
    this.dX = Math.sin(this.d * $g.constants.RADIAN);
    this.dY = Math.cos(this.d * $g.constants.RADIAN);

    perf.stop('_physics.obj.updateTrig');
  };

  // the faster you go, the more it resists
  temp.resistanceMaxSpeed = 80; // m/s at which the resistance is at maximum
  temp.resistanceMaxDecel = 12; // m/s^2 resistance at max m/s speed
  temp.resistanceMinDecel = .5; // always supply at least 0.5 m/s of resist
  obj.applyResistanceForce = function(elapsedSec, updateCount) { perf.start('_physics.obj.applyResistanceForce');
    if (updateCount % 4 !== 1) { // only run applyResistance every 10th frame. Fewer calculations
      perf.stop('_physics.obj.applyResistanceForce');
      return;
    }

    // always apply at least 1 m/s worth of decel
    temp.minResistForce = temp.resistanceMinDecel * this.mass;

    /* as speeds increase towards 100 m/s (either axis) begin to resist by applying negative force */
    this.forceResistX = (this.sX / temp.resistanceMaxSpeed) * temp.resistanceMaxDecel * this.mass;
    this.forceResistY = (this.sY / temp.resistanceMaxSpeed) * temp.resistanceMaxDecel * this.mass;

    // apply min resist in the absence of thrust force
    if (this.forceX === 0) {
      if (this.forceResistX > 0) {
        this.forceResistX += temp.minResistForce;
      } else if (this.forceResist < 0) {
        this.forceResistX -= temp.minResistForce;
      }
    }

    if (this.forceY === 0) {
      if (this.forceResistY > 0) {
        this.forceResistY += temp.minResistForce;
      } else if (this.forceResist < 0) {
        this.forceResistY -= temp.minResistForce;
      }
    }

    perf.stop('_physics.obj.applyResistanceForce');
  }

  // increment speed based on force
  temp.updateSpeedByForceElapsedSec = 0;
  obj.updateSpeedByForce = function (elapsedSec, updateCount) { perf.start('_physics.obj.updateSpeedByForce');
    if (updateCount % 4 !== 0) { // only run updateSpeedByThrust every 4th update. Fewer calculations
      temp.updateSpeedByForceElapsedSec += elapsedSec; // count up the elapsed secs
      perf.stop('_physics.obj.updateSpeedByForce');
      return;
    }

    temp.netForceX = this.forceX - this.forceResistX;
    temp.netForceY = this.forceY - this.forceResistY;

    // precalculate the amount to increase by force
    temp.sXIncrease = (temp.netForceX * temp.updateSpeedByForceElapsedSec / this.mass);
    temp.sYIncrease = (temp.netForceY * temp.updateSpeedByForceElapsedSec / this.mass);

    // apply increase
    this.sX += temp.sXIncrease;
    this.sY += temp.sYIncrease;

    temp.updateSpeedByForceElapsedSec = 0; // rest the counter
    perf.stop('_physics.obj.updateSpeedByForce');
  };


   // register update functions
  obj.updates.push('updatePosition');
  obj.updates.push('updateDirection');
  obj.updates.push('updateTrig');
  obj.updates.push('applyResistanceForce');
  obj.updates.push('updateSpeedByForce');

  perf.stop('_physics.add');
}

export default { add };
