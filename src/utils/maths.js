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

function getRadian2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) {
  // zero out center
  temp.zeroedX = pointX - centerX;
  temp.zeroedY = pointY - centerY;
  if (equalIsUp && temp.zeroedX === 0 && temp.zeroedY === 0) return halfPI;
  temp.radian = Math.atan2(temp.zeroedY, temp.zeroedX);
  return (temp.radian < 0) ? temp.radian + twoPI : temp.radian;
}

function getAngle2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) {
  temp.angle = getRadian2P(centerX, centerY, pointX, pointY, equalIsUp) * oneEightyByPI;
  if (temp.angle < 0) temp.angle += 360;
  return temp.angle;
}

function getDegree2P(centerX, centerY, pointX, pointY, equalIsUp = true /* will return up instead of undefined */) {
  temp.angle = radianToAngle(getRadian2P(centerX, centerY, pointX, pointY, equalIsUp));
  return angleToDegree(temp.angle);;
}

function _getRadian2P(p1, p2, equalIsUp = true /* will return up instead of undefined */) {
  // zero out p1
  p2Zeroed.x = p2.x - p1.x;
  p2Zeroed.y = p2.y - p1.y;
  if (equalIsUp && p2Zeroed.x === 0 && p2Zeroed.y === 0) return halfPI;
  radian = Math.atan2(p2Zeroed.y, p2Zeroed.x);
  return (radian < 0) ? radian + twoPI : radian;
}

function _getAngle2P(p1, p2, equalIsUp = true) {
  angle = getRadian2P(p1, p2, equalIsUp) * oneEightyByPI;
  if (angle < 0) angle = 360 + angle;
  return angle;
}

function _getDegree2P(p1, p2, equalIsUp = true) {
  angle = radianToAngle(getRadian2P(p1, p2, equalIsUp));
  // if (degree < 0) degree = 360 + degree;
  return angleToDegree(angle);
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)));
}

function angleToRadian(angle) {
  radian = angle * PIBy180;
  if (radian === twoPI) return 0;
  return (radian < 0) ? radian + twoPI : radian;
}

function degreeToRadian(degree) {
  return angleToRadian(degreeToAngle(degree));
}

function degreeToAngle(degree) {
  const transform = 360 - degree - 270;
  return (transform < 0) ? 360 + transform : transform;
}

function angleToDegree(angle) {
  const transform = 360 - angle - 270;
  return (transform < 0) ? 360 + transform : transform;
}

function radianToAngle(radian) {
  return radian * oneEightyByPI;
}

function radianToDegree(radian) {
  return angleToDegree(radianToAngle(radian));
}

function roundHalf(number) {
  return Math.ceil(number * 2) / 2;
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
};
