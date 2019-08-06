// TODO: update distance to reflect camera resolution to pixel ratio
import cardinalDirection from '../../utils/cardinalDirection.js';
import maths from '../../utils/maths.js';
import globals from '../../utils/globals.js';
import perf from '../../utils/perf.js';

function add(obj) { let p = perf.start('_physics.add');
  // DIRECTION
  if (obj.x === undefined) obj.x = 150; // coordinate
  if (obj.y === undefined) obj.y = 150; // coordinate
  if (obj.d === undefined) obj.d = 0; // in degrees. cardinal 0 is up, 359.9 is almost up

  // SPEED
  if (obj.s === undefined) obj.s = 0; // meters / second
  if (obj.sMax === undefined) obj.sMax = 100;
  if (obj.a === undefined) obj.a = 0; // acceleration m/s^2
  if (obj.aMax === undefined) obj.aMax = 6; // m/s^2

  // angular acceleration
  if (obj.aS === undefined) obj.aS = 0; // angle / second
  if (obj.aSMax === undefined) obj.aSMax = 45; // angle / second
  if (obj.aA === undefined) obj.aA = 0; // acceleration angle / second^2
  obj.dTurn = 0; // where the ship *wants* to go +/- from current

  // computed values
  obj.temp.lastPositionUpdate = Date.now();
  obj.temp.lastMomentumUpdate = Date.now();
  obj.temp.lastDirectionUpdate = Date.now();

  obj.temp.distX = 0; // tracks the last dist update
  obj.temp.distY = 0; // tracks the last dist update

/* allow for callbacks to be added for triggering on change */
  obj.callbacks = {};
  obj.addOnUpdate = function(key, name, func, overwrite = false) { let p = perf.start('_physics.obj.addOnUpdate');
    // first item? create {}
    if (!this.callbacks[key]) this.callbacks[key] = {};
    // set function if it doesn't exist already
    if (overwrite || !this.callbacks[key][name]) this.callbacks[key][name] = func;

    perf.stop('_physics.obj.addOnUpdate', p);
  }
  obj.set = function(key, value) { let p = perf.start('_physics.obj.set');
    if (this[key] === value) return;
    if (this.callbacks[key]) {
      for (this.temp.name in this.callbacks[key]) {
        this.callbacks[key][this.temp.name](value, this[key], this); // (newValue, oldValue)
      }
    }
    this[key] = value;
    perf.stop('_physics.obj.set', p);
  };

  obj.updatePosition = function(updateCount) { let p = perf.start('_physics.obj.updatePosition');
    this.temp.now = Date.now();
    this.temp.sin = Math.sin(this.d * globals.constants.RADIAN);
    this.temp.cos = Math.cos(this.d * globals.constants.RADIAN);
    this.temp.dist = this.s * ((this.temp.now - this.temp.lastPositionUpdate) / 1000);
    this.temp.distY = this.temp.cos * this.temp.dist;
    this.temp.distX = this.temp.sin * this.temp.dist;
    this.mX += this.temp.distX;
    this.mY += this.temp.distY;
    this.temp.lastPositionUpdate = this.temp.now;

    perf.stop('_physics.obj.updatePosition', p);
  };

  obj.updateMomentum = function (updateCount) { let p = perf.start('_physics.obj.updateMomentum');
    if (updateCount % 4 !== 0) {
      perf.stop('_physics.obj.updateMomentum', p);
      return;
    }
    this.temp.now = Date.now();
    this.temp.elapsed = (this.temp.now - this.temp.lastMomentumUpdate) / 1000;

    // apply acc to speed
    this.s += (this.a * this.temp.elapsed);

    this.temp.lastMomentumUpdate = this.temp.now;
    perf.stop('_physics.obj.updateMomentum', p);
  };

  obj.updateDirection = function() { let p = perf.start('_physics.obj.updateDirection');
    this.temp.now = Date.now();
    this.temp.elapsed = (this.temp.now - this.temp.lastDirectionUpdate) / 1000;

    if (this.dTurn === 0) { // no direction change
      this.temp.lastDirectionUpdate = this.temp.now;
      perf.stop('_physics.obj.updateDirection', p);
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
      this.aS += this.aA * this.temp.elapsed;
      // enforce maximum
      if (this.aS > this.aSMax) this.aS = this.aSMax;
    } else {
      this.aS += this.aA * this.temp.elapsed;
      // enforce maximum
      if (this.aS < -this.aSMax) this.aS = -this.aSMax;
    }

    // now increment direction
    this.d += this.aS * this.temp.elapsed;
    // take away from dTurn what has transpired
    this.set('dTurn', this.dTurn - this.aS * this.temp.elapsed)

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

    this.temp.lastDirectionUpdate = this.temp.now;

    perf.stop('_physics.obj.updateDirection', p);
  };

   // register update functions
  obj.updates.push('updatePosition');
  obj.updates.push('updateMomentum');
  obj.updates.push('updateDirection');

  perf.stop('_physics.add', p);
}

export default { add };
