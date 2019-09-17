import perf from './perf.js';

const halfPI = Math.PI / 2;
const oneEightyByPI = 180 / Math.PI;
const PIBy180 = Math.PI / 180;
const twoPI = Math.PI * 2;
const temp = {};

let p1Zeroed = { x: 0, y: 0 };
let p2Zeroed = { x: null, y: null };
let radian = null;
let angle = null;
let degree = null;

function getRadian2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) { perf.start('maths.getRadian2P');
  // zero out center
  temp.zeroedX = pointX - centerX;
  temp.zeroedY = pointY - centerY;
  if (equalIsUp && temp.zeroedX === 0 && temp.zeroedY === 0) {
    perf.stop('maths.getRadian2P');
    return halfPI;
  }
  temp.radian = Math.atan2(temp.zeroedY, temp.zeroedX);
  temp.result = (temp.radian < 0) ? temp.radian + twoPI : temp.radian;
  perf.stop('maths.getRadian2P');
  return temp.result;
}

function getAngle2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) { perf.start('maths.getAngle2P');
  temp.angle = getRadian2P(centerX, centerY, pointX, pointY, equalIsUp) * oneEightyByPI;
  if (temp.angle < 0) temp.angle += 360;
  perf.stop('maths.getAngle2P');
  return temp.angle;
}

function getDegree2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) { perf.start('maths.getDegree2P');
  temp.angle = radianToAngle(getRadian2P(centerX, centerY, pointX, pointY, equalIsUp));
  temp.result = angleToDegree(temp.angle);
  perf.stop('maths.getDegree2P');
  return temp.result;
}

function getDistance(x1, y1, x2, y2) { perf.start('maths.getDistance');
  temp.result = Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
  perf.stop('maths.getDistance');
  return temp.result;
}

function angleToRadian(angle) { perf.start('maths.angleToRadian');
  radian = angle * PIBy180;
  if (radian === twoPI) {
    perf.stop('maths.angleToRadian');
    return 0;
  }
  temp.result = (radian < 0) ? radian + twoPI : radian;
  perf.stop('maths.angleToRadian');
  return temp.result;
}

function degreeToRadian(degree) { perf.start('maths.degreeToRadian');
  temp.result = angleToRadian(degreeToAngle(degree));
  perf.stop('maths.degreeToRadian');
  return temp.result;
}

function degreeToAngle(degree) { perf.start('maths.degreeToAngle');
  const transform = 360 - degree - 270;
  temp.result = (transform < 0) ? 360 + transform : transform;
  perf.stop('maths.degreeToAngle');
  return temp.result;
}

function angleToDegree(angle) { perf.start('maths.degreeToAngle');
  const transform = 360 - angle - 270;
  temp.result = (transform < 0) ? 360 + transform : transform;
  perf.stop('maths.degreeToAngle');
  return temp.result;
}

function radianToAngle(radian) { perf.start('maths.radianToAngle');
  temp.result = radian * oneEightyByPI;
  perf.stop('maths.radianToAngle');
  return temp.result;
}

function radianToDegree(radian) { perf.start('maths.radianToDegree');
  temp.result = angleToDegree(radianToAngle(radian));
  perf.stop('maths.radianToDegree');
  return temp.result;
}

function roundHalf(number) { perf.start('maths.roundHalf');
  temp.result = Math.ceil(number * 2) / 2;
  perf.stop('maths.roundHalf');
  return temp.result;
}

function random(a = 0, b = 10) { perf.start('maths.random'); // accepts a range of 2 numbers
  if (a > b) {
    temp.max = a;
    temp.min = b;
  } else {
    temp.min = a;
    temp.max = b;
  }
  temp.result = Math.floor(Math.random() * (temp.max - temp.min + 1)) + temp.min;
  perf.stop('maths.random');
  return temp.result;
}

function getRotation(baseDegree, otherDegree) {
  baseDegree = baseDegree % 360;
  otherDegree = otherDegree % 360;
  temp.diff = Math.abs(otherDegree - baseDegree);
  temp.result = temp.diff > 180 ? 360 - temp.diff : temp.diff;
  // solve for direction
  temp.clockwise = (otherDegree - baseDegree >= 0 && otherDegree - baseDegree <= 180) || (otherDegree - baseDegree <=-180 && otherDegree- baseDegree >= -360) ? 1 : -1;
  return temp.result *= temp.clockwise;
}

export default {
  getAngle2P,
  getRadian2P,
  getDegree2P,
  getDistance,
  angleToRadian,
  degreeToRadian,
  degreeToAngle,
  angleToDegree,
  radianToDegree,
  radianToAngle,
  roundHalf,
  random,
  getRotation,
};
