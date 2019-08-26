/*
  Memory save and stutter avoider
  Pregenerates actors into memory. Bank the ones not in use, retrieve from bank instead of creating new ones.

  To get an entity for use, pop() it from $g.bank.entity
*/
import Projectile from './projectile.js';
import Asteroid from './asteroid.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const temp = {};

function init() { perf.start('_factory.init');
  // make 200 projectiles
  for (temp.x = 0; temp.x < 200; temp.x++) {
    $g.bank.projectiles[temp.x] = new Projectile();
    $g.bank.projectiles[temp.x].remove = function() { perf.start('_factory.projectile.remove');
      $g.bank.projectiles.push(this);
      delete $g.game.projectiles[this.id]; // removes the reference only. Original object is safe in bank.
      return perf.start('_factory.projectile.remove');
    };
  }
  // make 20 asteroids
  for (temp.x = 0; temp.x < 60; temp.x++) {
    $g.bank.asteroids[temp.x] = new Asteroid();
    $g.bank.asteroids[temp.x].remove = function() { perf.start('_factory.asteroid.remove');
      $g.bank.asteroids.push(this);
      delete $g.game.actors[this.id]; // removes the reference only. Original object is safe in bank.
      return perf.stop('_factory.asteroid.remove');
    };
  }
  perf.stop('_factory.init');

  // TODO: make 20 ships
  // TODO: make 200 particles
  // TODO: detect and handle shortages
}

export default { init };
