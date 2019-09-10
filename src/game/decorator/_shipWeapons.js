import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import { cloneDeep } from 'lodash';

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
  obj.rotateTurretsToTarget = rotateTurretsToTarget;

  obj.addUpdate('rotateTurretsToTarget', 100, 12);

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

  temp.projectile = $g.bank.projectiles.pop();
  // wipe this projectile
  temp.projectile.init({
    type: 0,
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

    temp.projectile = $g.bank.projectiles.pop();
    // wipe this projectile
    temp.projectile.init({
      type: 0,
      mX: this.mX + (temp.distX * this.length / 100),
      mY: this.mY - (temp.distY * this.length / 100),
      d: turret.d + this.d + temp.randDir, // for now always fire at 45 deg
      exemptColliders: { [`${this.id}`]: this }
    });
  });
  perf.stop('_shipWeapons.obj.fireTurrets');
}

function rotateTurretsToTarget(elapsed) { perf.start('_shipWeapons.obj.rotateTurretsToTarget');
  if (!this.target) return perf.stop('_shipWeapons.obj.rotateTurretsToTarget');
  // solve for eventual target locaiton
  temp.dist = maths.getDistance(this.mX, this.mY, $g.game.actors[this.target].mX, $g.game.actors[this.target].mY);
  // at distance, how long projectile to get there?
  temp.timeToTarget = temp.dist / 150; // speed of projectile. NEEDS UPDATE
  temp.direction = maths.getDegree2P(
    this.mX,
    this.mY,
    $g.game.actors[this.target].mX + (temp.timeToTarget * $g.game.actors[this.target].sX), // projecting out for eventual location
    $g.game.actors[this.target].mY + (temp.timeToTarget * $g.game.actors[this.target].sY),
  );
  
  this.turrets.map((turret) => {
    turret.dTarget = Math.abs(temp.direction - this.d);
    // get the difference between (turret.d - ship.d) and target direction
    temp.dDiff = 180 - Math.abs(Math.abs(turret.dTarget - turret.d) - 180);
    if (temp.dDiff === 0) return;
    // now figure out if turn right or left
    temp.isRight = 1;
    if (Math.abs((turret.d - temp.dDiff + 360) % 360) === turret.dTarget) {
      temp.isRight = -1;
    }

    // now turn the turrets accordingly
    temp.turn = turret.aS * elapsed * temp.isRight;

    // test for overturn
    if (temp.dDiff - Math.abs(temp.turn) < 0) {
      turret.d = turret.dTarget;
      temp.turn = 0;
    }
    turret.d += temp.turn;
    turret.d = turret.d % 360;
  });
  perf.stop('_shipWeapons.obj.rotateTurretsToTarget');
}

export default { add, getProperties };
