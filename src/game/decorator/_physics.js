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
  obj.dLast = -1.1; // different from d, to trigger update
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

  obj.updatePosition = function(elapsed) { perf.start('_physics.obj.updatePosition');
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

  // register update functions
  obj.addUpdate('updatePosition', 21);
  obj.addUpdate('updateDirection', 20);
  obj.addUpdate('applyResistanceForce', 12, 4);
  obj.addUpdate('updateSpeedByForce', 13, 4);

  perf.stop('_physics.add');
}

export default { add };
