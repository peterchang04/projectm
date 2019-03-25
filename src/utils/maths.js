const halfPI = Math.PI / 2;
const oneEightyByPI = 180 / Math.PI;
const PIBy180 = Math.PI / 180;
const twoPI = Math.PI * 2;
let p1Zeroed = { x: 0, y: 0 };
let p2Zeroed = { x: null, y: null };
let radian = null;
let angle = null;
let degree = null;
function getRadian2P(p1, p2, equalIsUp = true /* will return up instead of undefined */) {
  // zero out p1
  p2Zeroed.x = p2.x - p1.x;
  p2Zeroed.y = p2.y - p1.y;
  if (equalIsUp && p2Zeroed.x === 0 && p2Zeroed.y === 0) return halfPI;
  radian = Math.atan2(p2Zeroed.y, p2Zeroed.x);
  return (radian < 0) ? radian + twoPI : radian;
}

function getAngle2P(p1, p2, equalIsUp = true) {
  angle = getRadian2P(p1, p2, equalIsUp) * oneEightyByPI;
  if (angle < 0) angle = 360 + angle;
  return angle;
}

function getDegree2P(p1, p2, equalIsUp = true) {
  angle = radianToAngle(getRadian2P(p1, p2, equalIsUp));
  // if (degree < 0) degree = 360 + degree;
  return angleToDegree(angle);
}

function getDistance2P(p1, p2) {
  return Math.sqrt(((p1.x - p2.x) * (p1.x - p2.x)) + ((p1.y - p2.y) * (p1.y - p2.y)));
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
  getDistance2P,
  angleToRadian,
  degreeToRadian,
  degreeToAngle,
  angleToDegree,
  radianToDegree,
  radianToAngle,
  roundHalf,
};
