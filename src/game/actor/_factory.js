/*
  Memory save and stutter avoider
  Pregenerates actors into memory. Bank the ones not in use, retrieve from bank instead of creating new ones.
*/
import Projectile from './projectile.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const projectileBank = [];
const temp = {};

function init() { perf.start('_factory.init');
  // make 200 projectiles
  for (temp.x = 0; temp.x < 200; temp.x++) {
    projectileBank[temp.x] = new Projectile();
    projectileBank[temp.x].remove = function() { perf.start('_factory.projectile.remove');
      projectileBank.push(this);
      delete $g.game.actors[this.id]; // removes the reference only. Original object is safe in bank.
      perf.start('_factory.projectile.remove');
      return;
    };
  }
  perf.stop('_factory.init');
}

// modelled like the constructor
function getProjectile(initialObj) { perf.start('_factory.getProjectile');
  temp.projectile = projectileBank.pop();
  Object.assign(temp.projectile, initialObj);
  temp.projectile.applyType();
  perf.stop('_factory.getProjectile');
  return temp.projectile;
}

export default { getProjectile, init };
