import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import { cloneDeep } from 'lodash';
import { turretTypes, projectileTypes } from '../../definitions.js';

const temp = {}; // memory pointer to avoid allocation for new variables
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  cannonShots: 0, // increments as cannons fire. Mod this to get which cannon is firing
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_shipWeapons.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions to obj
  obj.fireCannon = fireCannon;
  obj.fireTurrets = fireTurrets;
  obj.updateTurretTargetDirection = updateTurretTargetDirection;
  obj.rotateTurrets = rotateTurrets;

  obj.addUpdate('updateTurretTargetDirection', 100, 12); // this is a colculation - don't do it as often
  obj.addUpdate('rotateTurrets', 101, 4); // this is the incremental movement towards dTarget for turret

  perf.stop('_shipWeapons.add');
}

// more thrust eq more force (eq more speed)
function fireCannon() { perf.start('_shipWeapons.obj.fireCannon');
  temp.cannon = this.cannons[this.cannonShots % this.cannons.length];
  this.cannonShots++;
  
  temp.distX = temp.cannon.x;
  temp.distY = -temp.cannon.y;

  if (this.id == $g.game.myShip.id) { // rotate for self perspective
    temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
    temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
    temp.distX = temp.distXPrime;
    temp.distY = temp.distYPrime;
  }

  temp.randDir = 1.5 * (maths.random(-100, 100) / 100); // 1.5% variance

  $g.bank.getParticle({
    type: 'flash',
    c: '#ffbd49',
    d: this.d,
    sX: this.sX,
    sY: this.sY,
    length: 10,
    mX: this.mX + (temp.distX * this.length / 100),
    mY: this.mY - (temp.distY * this.length / 100),
    animateFrames: 8,
  });

  $g.bank.getProjectile({
    type: temp.cannon.projectileType,
    mX: this.mX + (temp.distX * this.length / 100),
    mY: this.mY - (temp.distY * this.length / 100),
    d: this.d + temp.randDir,
    exemptColliders: { [`${this.id}`]: this }
  });
  perf.stop('_shipWeapons.obj.fireCannon');
}

// more thrust eq more force (eq more speed)
function fireTurrets() { perf.start('_shipWeapons.obj.fireTurrets');
  this.turrets.map((turret) => {
    temp.distX = turret.x;
    temp.distY = -turret.y;

    if (this.id == $g.game.myShip.id) { // rotate for self perspective
      temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
      temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
      temp.distX = temp.distXPrime;
      temp.distY = temp.distYPrime;
    }

    temp.randDir = 3 * (maths.random(-100, 100) / 100); // 3% variance

    $g.bank.getParticle({
      type: 'flash',
      c: '#ff6868',
      d: this.d,
      sX: this.sX,
      sY: this.sY,
      length: 5,
      mX: this.mX + (temp.distX * this.length / 100),
      mY: this.mY - (temp.distY * this.length / 100),
    });

    // wipe this projectile
    $g.bank.getProjectile({
      type: turretTypes[turret.type].projectileType,
      mX: this.mX + (temp.distX * this.length / 100),
      mY: this.mY - (temp.distY * this.length / 100),
      d: turret.d + this.d + temp.randDir, // for now always fire at 45 deg
      exemptColliders: { [`${this.id}`]: this }
    });
  });
  perf.stop('_shipWeapons.obj.fireTurrets');
}

function updateTurretTargetDirection() { perf.start('_shipWeapons.obj.updateTurretTargetDirection');
  if (!this.target) {
    // point forward if no target
    this.turrets.map((turret) => {
      turret.dTarget = 0;
    });
    return perf.stop('_shipWeapons.obj.updateTurretTargetDirection');
  }
  // solve for target locaiton, used to predict eventual target position
  temp.dist = maths.getDistance(this.mX, this.mY, $g.game.actors[this.target].mX, $g.game.actors[this.target].mY);
  this.turrets.map((turret) => {
    // at distance, how long projectile to get there?
    temp.timeToTarget = temp.dist / projectileTypes[turretTypes[turret.type].projectileType].sMax; // speed of projectile.
    temp.direction = maths.getDegree2P(
      this.mX,
      this.mY,
      $g.game.actors[this.target].mX + (temp.timeToTarget * $g.game.actors[this.target].sX), // projecting out for eventual location
      $g.game.actors[this.target].mY + (temp.timeToTarget * $g.game.actors[this.target].sY),
    );
    // dTarget is relative to ship. so d:0 is the same direction as ship
    turret.dTarget = Math.abs(temp.direction - this.d);
  });

  perf.stop('_shipWeapons.obj.updateTurretTargetDirection');
}

function rotateTurrets(elapsed) { perf.start('_shipWeapons.obj.rotateTurrets');
  this.turrets.map((turret) => {
    // initialize d
    if (turret.d === undefined) turret.d = 0;
    if (turret.dTarget === undefined) turret.dTarget = 0;
    // exit early if no change necessary
    if (turret.d === turret.dTarget) return;

    // determine direction to turn
    temp.isClockwise = 1;
    if (turret.d < turret.dTarget) {
      temp.clockwiseDist = turret.dTarget - turret.d;
      temp.counterClockwiseDist = turret.d + 360 - turret.dTarget;
    } else {
      temp.counterClockwiseDist = turret.d - turret.dTarget;
      temp.clockwiseDist = turret.dTarget + 360 - turret.d;
    }
    if (temp.counterClockwiseDist < temp.clockwiseDist) temp.isClockwise = -1;

    // now increment
    if (temp.isClockwise === 1) {
      temp.dist = turretTypes[turret.type].aS * elapsed;
      if (temp.dist > temp.clockwiseDist) temp.dist = temp.clockwiseDist;
    } else {
      temp.dist = turretTypes[turret.type].aS * elapsed;
      if (temp.dist > temp.counterClockwiseDist) temp.dist = temp.counterClockwiseDist;
      temp.dist = temp.dist * -1;
    }

    turret.d += temp.dist;
    turret.d = turret.d % 360;
  });
  perf.stop('_shipWeapons.obj.rotateTurrets');
}

export default { add, getProperties };
