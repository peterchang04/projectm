// TODO: update distance to reflect camera resolution to pixel ratio
import cardinalDirection from '../utils/cardinalDirection.js';

function add(obj) {
  if (obj.x === undefined) obj.x = 150; // coordinate
  if (obj.y === undefined) obj.y = 150; // coordinate
  if (obj.d === undefined) obj.d = 0; // in degrees. cardinal 0 is up, 359.9 is almost up
  if (obj.s === undefined) obj.s = 0; // meters / second
  if (obj.a === undefined) obj.a = 0; // acceleration m/s^2
  if (obj.aS === undefined) obj.aS = 0; // angle / second
  if (obj.aA === undefined) obj.aA = 0; // acceleration angle / second^2
  // computed values
  obj.lastPositionUpdate = Date.now();
  obj.angle = cardinalDirection.toAngle(obj.d);
  obj.radian = cardinalDirection.toRadian(obj.d);

  obj.updatePosition = function() {
    const now = Date.now();
    const elapsed = now - this.lastPositionUpdate;
    const sin = Math.sin(this.radian);
    const cos = Math.cos(this.radian);
    const dist = this.s * (elapsed / 1000);
    const distY = cos * dist * -1;
    const distX = sin * dist;
    this.x += distX;
    this.y += distY;
    return true;
  };

  obj.updateMomentum = function () {
    const now = Date.now();
    const elapsed = now - this.lastPositionUpdate;
    if (this.a) this.s += (this.a * (elapsed / 1000));
    if (this.aA) this.aS += (this.aA * (elapsed / 1000));
  }

  if (!obj.updates) obj.updates = []; // obj has stack of update functions
   // register update functions
  obj.updates.push('updatePosition');
  obj.updates.push('updateMomentum');
}

export default { add };
