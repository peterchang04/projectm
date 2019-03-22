// TODO: update distance to reflect camera resolution to pixel ratio
import cardinalDirection from '../../utils/cardinalDirection.js';
import globals from '../../utils/globals.js';

function add(obj) {
  if (obj.x === undefined) obj.x = 150; // coordinate
  if (obj.y === undefined) obj.y = 150; // coordinate
  if (obj.d === undefined) obj.d = 0; // in degrees. cardinal 0 is up, 359.9 is almost up
  if (obj.s === undefined) obj.s = 0; // meters / second
  if (obj.a === undefined) obj.a = 0; // acceleration m/s^2
  if (obj.aS === undefined) obj.aS = 0; // angle / second
  if (obj.aA === undefined) obj.aA = 0; // acceleration angle / second^2
  // computed values
  obj.temp.lastPositionUpdate = Date.now();
  obj.temp.lastMomentumUpdate = Date.now();
  obj.angle = cardinalDirection.toAngle(obj.d);
  obj.radian = cardinalDirection.toRadian(obj.d);
  obj.temp.distX = 0; // tracks the last dist update
  obj.temp.distY = 0; // tracks the last dist update

  obj.updatePosition = function(updateCount) {
    this.temp.now = Date.now();
    this.temp.sin = Math.sin(this.d * globals.constants.RADIAN);
    this.temp.cos = Math.cos(this.d * globals.constants.RADIAN);
    this.temp.dist = this.s * ((this.temp.now - this.temp.lastPositionUpdate) / 1000);
    this.temp.distY = this.temp.cos * this.temp.dist;
    this.temp.distX = this.temp.sin * this.temp.dist;
    this.mX += this.temp.distX;
    this.mY += this.temp.distY;
    this.temp.lastPositionUpdate = this.temp.now;
  };

  obj.updateMomentum = function (updateCount) {
    if (updateCount % 4 !== 0) return;
    this.temp.now = Date.now();
    // apply acceleration
    if (this.a !== 0) {
       this.s += (this.a * ((this.temp.now - this.temp.lastMomentumUpdate) / 1000));
    }
    // limit speed.
    if (this.s > this.sMax) {
      this.s = this.sMax;
    }

    // apply angular accel
    if (this.aA !== 0) this.aS += (this.aA * ((this.temp.now - this.temp.lastMomentumUpdate) / 1000));
    this.temp.lastMomentumUpdate = this.temp.now;
  }

  if (!obj.updates) obj.updates = []; // obj has stack of update functions
   // register update functions
  obj.updates.push('updatePosition');
  obj.updates.push('updateMomentum');
}

export default { add };
