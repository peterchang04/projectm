import maths from './maths.js';
const RADIAN = Math.PI / 180;

function toAngle(cardinalDegrees) { /* where 0 is up  and 359.99 is almost up */
  return maths.degreeToAngle(cardinalDegrees);
}

function toRadian(cardinalDegrees) { /* where 0 is up  and 359.99 is almost up */
  return maths.degreeToRadian(cardinalDegrees);
}

function toCardinal(angle) {
  return maths.angleToDegree(angle);
}

export default { toRadian, toAngle, toCardinal };
