const RADIAN = Math.PI / 180;

function toAngle(cardinalDegrees) { /* where 0 is up  and 359.99 is almost up */
  const transform = 360 - cardinalDegrees - 270;
  return (transform < 0) ? 360 + transform : transform;
}

function toRadian(cardinalDegrees) { /* where 0 is up  and 359.99 is almost up */
  return toAngle(cardinalDegrees) * RADIAN;
}

export default { toRadian, toAngle };
