/*
  Memory save and stutter avoider
  Pregenerates actors into memory. Bank the ones not in use, retrieve from bank instead of creating new ones.
*/
import Projectile from './projectile.js';
import Asteroid from './asteroid.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const bank = {
  projectiles: [],
  asteroids: [],
};
const temp = {};

function init() { perf.start('_factory.init');
  // make 200 projectiles
  for (temp.x = 0; temp.x < 200; temp.x++) {
    bank.projectiles[temp.x] = new Projectile();
    bank.projectiles[temp.x].factoryReturn = function() { perf.start('_factory.projectile.remove');
      bank.projectiles.push(this);
      delete $g.game.projectiles[this.id]; // removes the reference only. Original object is safe in bank.
      perf.start('_factory.projectile.remove');
      return;
    };
  }
  // make 20 asteroids
  for (temp.x = 0; temp.x < 60; temp.x++) {
    bank.asteroids[temp.x] = new Asteroid();
    bank.asteroids[temp.x].factoryReturn = function() { perf.start('_factory.asteroid.remove');
      bank.asteroids.push(this);
      delete $g.game.actors[this.id]; // removes the reference only. Original object is safe in bank.
      perf.start('_factory.asteroid.remove');
      return;
    };
  }
  perf.stop('_factory.init');
}

// modelled like the constructor
function getProjectile(initialObj) { perf.start('_factory.getProjectile');
  temp.projectile = bank.projectiles.pop();
  Object.assign(temp.projectile, initialObj);
  temp.projectile.resetCollision();
  temp.projectile.applyType();
  temp.projectile.setupPolygon();
  // preserve incoming exemptColliders
  temp.projectile.exemptColliders = initialObj.exemptColliders || {};
  // now get its place in world
  temp.projectile.testAllCollidees();
  perf.stop('_factory.getProjectile');
  return temp.projectile;
}

// modelled like the constructor
function getAsteroid(initialObj) { perf.start('_factory.getAsteroid');
  temp.asteroid = bank.asteroids.pop();
  Object.assign(temp.asteroid, initialObj);
  console.log(temp.asteroid.length, 'length1');
  temp.asteroid.applyType();
  temp.asteroid.setupPolygon();
  console.log(temp.asteroid.length, 'length2');
  perf.stop('_factory.getAsteroid');
  return temp.asteroid;
}


export default {
  init,
  getProjectile,
  getAsteroid,
};
