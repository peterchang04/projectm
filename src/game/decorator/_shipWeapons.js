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
      type: 1,
      mX: this.mX + (temp.distX * this.length / 100),
      mY: this.mY - (temp.distY * this.length / 100),
      d: 45 + temp.randDir, // for now always fire at 45 deg
      exemptColliders: { [`${this.id}`]: this }
    });
  });
  perf.stop('_shipWeapons.obj.fireTurrets');
}

export default { add, getProperties };
