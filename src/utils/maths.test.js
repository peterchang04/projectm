import { expect } from 'chai';
const it = global.it;
const describe = global.describe;
import maths from '../../src/utils/maths.js';


describe('getRadian2P', () => {
  it('should return 0 if 3rd argument is false, but both points same', () => {
    expect(maths.getRadian2P(0, 0, 0, 0, false)).to.equal(0);
    expect(maths.getRadian2P(0, 0, 0, 0, true)).to.equal(Math.PI / 2);
  });

  it('should work with centered p1', () => {
    expect(maths.getRadian2P(0, 0, 1, 1)).to.equal(Math.PI / 4);
    expect(maths.getRadian2P(0, 0, 1, 0)).to.equal(0);
    expect(maths.getRadian2P(0, 0, 1, -1)).to.equal(7 * Math.PI / 4);
    expect(maths.getRadian2P(0, 0, 0, -1)).to.equal(3 * Math.PI / 2);
    expect(maths.getRadian2P(0, 0, -1, -1)).to.equal(5 * Math.PI / 4);
    expect(maths.getRadian2P(0, 0, -1, 0)).to.equal(Math.PI);
    expect(maths.getRadian2P(0, 0, -1, 1)).to.equal(3 * Math.PI / 4);
    expect(maths.getRadian2P(0, 0, 0, 1)).to.equal(Math.PI / 2);
  });

  it('should work with off center p1', () => {
    expect(maths.getRadian2P(1, 1, 0, 0)).to.equal(5 * Math.PI / 4);
  });
});

describe('getAngle2P', () => {
  it('should return 0 if 3rd argument is false, but both points same', () => {
    expect(maths.getAngle2P(0, 0, 0, 0, false)).to.equal(0);
    expect(maths.getAngle2P(0, 0, 0, 0, true)).to.equal(90);
  });

  it('should work with centered p1', () => {
    expect(maths.getAngle2P(0, 0, 1, 1)).to.equal(45);
    expect(maths.getAngle2P(0, 0, 1, 0)).to.equal(0);
    expect(maths.getAngle2P(0, 0, 1, -1)).to.equal(315);
    expect(maths.getAngle2P(0, 0, 0, -1)).to.equal(270);
    expect(maths.getAngle2P(0, 0, -1, -1)).to.equal(225);
    expect(maths.getAngle2P(0, 0, -1, 0)).to.equal(180);
    expect(maths.getAngle2P(0, 0, -1, 1)).to.equal(135);
    expect(maths.getAngle2P(0, 0, 0, 1)).to.equal(90);
  });

  it('should work with off center p1', () => {
    expect(maths.getAngle2P(1, 1, 0, 0)).to.equal(225);
  });
});

describe('getDegree2P', () => {
  it('should return 0 if 3rd argument is false, but both points same', () => {
    expect(maths.getDegree2P(0, 0, 0, 0, false)).to.equal(90);
    expect(maths.getDegree2P(0, 0, 0, 0, true)).to.equal(0);
  });

  it('should work with centered p1', () => {
    expect(maths.getDegree2P(0, 0, 1, 1)).to.equal(45);
    expect(maths.getDegree2P(0, 0, 1, 0)).to.equal(90);
    expect(maths.getDegree2P(0, 0, 1, -1)).to.equal(135);
    expect(maths.getDegree2P(0, 0, 0, -1)).to.equal(180);
    expect(maths.getDegree2P(0, 0, -1, -1)).to.equal(225);
    expect(maths.getDegree2P(0, 0, -1, 0)).to.equal(270);
    expect(maths.getDegree2P(0, 0, -1, 1)).to.equal(315);
    expect(maths.getDegree2P(0, 0, 0, 1)).to.equal(0);
  });

  it('should work with off center p1', () => {
    expect(maths.getDegree2P(1, 1, 0, 0)).to.equal(225);
  });
});

describe('getDistance', () => {
  it('should work for cardinal directions', () => {
    expect(maths.getDistance(0,0,0,2)).to.equal(2);
    expect(maths.getDistance(0,0,2,0)).to.equal(2);
    expect(maths.getDistance(0,0,-2,0)).to.equal(2);
    expect(maths.getDistance(0,0,0,-2)).to.equal(2);
  });

  it('should work with diagnals', () => {
    expect(maths.getDistance(0,0,2,2).toFixed(4)).to.equal('2.8284');
    expect(maths.getDistance(0,0,2,-2).toFixed(4)).to.equal('2.8284');
    expect(maths.getDistance(0,0,-2,2).toFixed(4)).to.equal('2.8284');
    expect(maths.getDistance(0,0,-2,-2).toFixed(4)).to.equal('2.8284');
  });

  it('should work with off center p1', () => {
    expect(maths.getDistance(1,1,-1,-1).toFixed(4)).to.equal('2.8284');
  });
});

describe('angleToRadian', () => {
  it('should work with major angles', () => {
    expect(maths.angleToRadian(0)).to.equal(0);
    expect(maths.angleToRadian(90)).to.equal(Math.PI / 2);
    expect(maths.angleToRadian(180)).to.equal(Math.PI);
    expect(maths.angleToRadian(270)).to.equal(3 * Math.PI / 2);
    expect(maths.angleToRadian(45)).to.equal(Math.PI / 4);
    expect(maths.angleToRadian(135)).to.equal(Math.PI * 3 / 4);
    expect(maths.angleToRadian(225)).to.equal(Math.PI * 5 / 4);
    expect(maths.angleToRadian(315)).to.equal(Math.PI * 7 / 4);
  });
  it('should work with edge cases', () => {
    expect(maths.angleToRadian(-45)).to.equal(Math.PI * 7 / 4);
    expect(maths.angleToRadian(360)).to.equal(0);
  });
});

describe('degreeToRadian', () => {
  it('should work with major angles', () => {
    expect(maths.degreeToRadian(90)).to.equal(0);
    expect(maths.degreeToRadian(0)).to.equal(Math.PI / 2);
    expect(maths.degreeToRadian(270)).to.equal(Math.PI);
    expect(maths.degreeToRadian(180)).to.equal(3 * Math.PI / 2);
    expect(maths.degreeToRadian(45)).to.equal(Math.PI / 4);
    expect(maths.degreeToRadian(315)).to.equal(Math.PI * 3 / 4);
    expect(maths.degreeToRadian(225)).to.equal(Math.PI * 5 / 4);
    expect(maths.degreeToRadian(135)).to.equal(Math.PI * 7 / 4);
  });
  it('should work with edge cases', () => {
    expect(maths.degreeToRadian(-45)).to.equal(Math.PI * 3 / 4);
    expect(maths.degreeToRadian(360)).to.equal(Math.PI / 2);
  });
});

describe('degreeToAngle', () => {
  it('should work with major angles', () => {
    expect(maths.degreeToAngle(90)).to.equal(0);
    expect(maths.degreeToAngle(0)).to.equal(90);
    expect(maths.degreeToAngle(270)).to.equal(180);
    expect(maths.degreeToAngle(180)).to.equal(270);
    expect(maths.degreeToAngle(45)).to.equal(45);
    expect(maths.degreeToAngle(315)).to.equal(135);
    expect(maths.degreeToAngle(225)).to.equal(225);
    expect(maths.degreeToAngle(135)).to.equal(315);
  });
  it('should work with edge cases', () => {
    expect(maths.degreeToAngle(-45)).to.equal(135);
    expect(maths.degreeToAngle(360)).to.equal(90);
  });
});

describe('angleToDegree', () => {
  it('should work with major angles', () => {
    expect(maths.angleToDegree(0)).to.equal(90);
    expect(maths.angleToDegree(90)).to.equal(0);
    expect(maths.angleToDegree(180)).to.equal(270);
    expect(maths.angleToDegree(270)).to.equal(180);
    expect(maths.angleToDegree(45)).to.equal(45);
    expect(maths.angleToDegree(135)).to.equal(315);
    expect(maths.angleToDegree(225)).to.equal(225);
    expect(maths.angleToDegree(315)).to.equal(135);
  });
  it('should work with edge cases', () => {
    expect(maths.angleToDegree(-1)).to.equal(91);
    expect(maths.angleToDegree(361)).to.equal(89);
    expect(maths.angleToDegree(360)).to.equal(90);
    expect(maths.angleToDegree(359)).to.equal(91);
  });
});

describe('radianToAngle', () => {
  it('should work with major angles', () => {
    expect(maths.radianToAngle(0)).to.equal(0);
    expect(maths.radianToAngle(Math.PI / 2)).to.equal(90);
    expect(maths.radianToAngle(Math.PI)).to.equal(180);
    expect(maths.radianToAngle(3 * Math.PI / 2)).to.equal(270);
    expect(maths.radianToAngle(Math.PI / 4)).to.equal(45);
    expect(maths.radianToAngle(Math.PI * 3 / 4)).to.equal(135);
    expect(maths.radianToAngle(Math.PI * 5 / 4)).to.equal(225);
    expect(maths.radianToAngle(Math.PI * 7 / 4)).to.equal(315);
  });
});

describe('radianToDegree', () => {
  it('should work with major angles', () => {
    expect(maths.radianToDegree(0)).to.equal(90);
    expect(maths.radianToDegree(Math.PI / 2)).to.equal(0);
    expect(maths.radianToDegree(Math.PI)).to.equal(270);
    expect(maths.radianToDegree(3 * Math.PI / 2)).to.equal(180);
    expect(maths.radianToDegree(Math.PI / 4)).to.equal(45);
    expect(maths.radianToDegree(Math.PI * 3 / 4)).to.equal(315);
    expect(maths.radianToDegree(Math.PI * 5 / 4)).to.equal(225);
    expect(maths.radianToDegree(Math.PI * 7 / 4)).to.equal(135);
  });
  it('should work with edge cases', () => {
    expect(maths.radianToDegree((Math.PI * 7 / 4) - Math.PI * 2)).to.equal(135);
  });
});

describe('random', () => {
  it('-3 to 3', () => {
    let isValid = true;
    let has3 = '';
    let hasNeg3 = '';
    for (var i = 0; i < 100; i++) {
      let result = maths.random(-3, 3);
      if (result < -3 || result > 3) isValid = false;
      if (result === 3) has3 = 'has3';
      if (result === -3) hasNeg3 = 'hasNeg3';
    }
    expect(isValid).to.equal(true);
    expect(has3).to.equal('has3');
    expect(hasNeg3).to.equal('hasNeg3');
  });
  it('3 to -3 (reverse args)', () => {
    let isValid = true;
    let has3 = false;
    let hasNeg3 = false
    for (var i = 0; i < 100; i++) {
      let result = maths.random(3, -3);
      if (result < -3 || result > 3) isValid = false;
      if (result === 3) has3 = 'has3';
      if (result === -3) hasNeg3 = 'hasNeg3';
    }
    expect(isValid).to.equal(true);
    expect(has3).to.equal('has3');
    expect(hasNeg3).to.equal('hasNeg3');
  });
  it('0-10', () => {
    let isValid = true;
    let has10 = false;
    let has0 = false
    for (var i = 0; i < 100; i++) {
      let result = maths.random(10);
      if (result < 0 || result > 10) isValid = false;
      if (result === 10) has10 = 'has10';
      if (result === 0) has0 = 'has0';
    }
    expect(isValid).to.equal(true);
    expect(has10).to.equal('has10');
    expect(has0).to.equal('has0');
  });
});
