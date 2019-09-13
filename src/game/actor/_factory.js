/*
  Memory save and stutter avoider
  Pregenerates actors into memory. Bank the ones not in use, retrieve from bank instead of creating new ones.

  To get an entity for use, pop() it from $g.bank.entity
*/
import Projectile from './Projectile.js';
import Asteroid from './Asteroid.js';
import Particle from './Particle.js';
import Ship from './Ship.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const temp = {};

function init() { perf.start('_factory.init');
  // clear actors and stuff
  $g.game.actors = {};
  $g.game.projectiles = {};
  $g.game.particles = {};

  $g.bank.ships = [];
  $g.bank.projectiles = [];
  $g.bank.asteroids = [];

  // attach fetch function for each bank type
  Object.keys($g.bank).map((bankName) => {
    if (bankName.substring(0, 3) === 'get') return;
    $g.bank[`get${bankName.charAt(0).toUpperCase()}${bankName.substring(1, bankName.length - 1)}`] = (initialObj) => {
      return get(bankName, initialObj);
    };
  });

  // make 25 ships - ships are first to reserve id:0 for crew
  for (temp.x = 0; temp.x < 25; temp.x++) {
    $g.bank.ships[temp.x] = new Ship();
    $g.bank.ships[temp.x].className = 'Ship'; // need this because the built version loses constructor.name
    $g.bank.ships[temp.x].remove = remove;
  }

  // make 200 projectiles
  for (temp.x = 0; temp.x < 100; temp.x++) {
    $g.bank.projectiles[temp.x] = new Projectile();
    $g.bank.projectiles[temp.x].className = 'Projectile';
    $g.bank.projectiles[temp.x].remove = remove;
  }

  // make 20 asteroids
  for (temp.x = 0; temp.x < 40; temp.x++) {
    $g.bank.asteroids[temp.x] = new Asteroid();
    $g.bank.asteroids[temp.x].className = 'Asteroid';
    $g.bank.asteroids[temp.x].remove = remove;
  }

  // make 200 particles
  for (temp.x = 0; temp.x < 100; temp.x++) {
    $g.bank.particles[temp.x] = new Particle();
    $g.bank.particles[temp.x].className = 'Particle';
    $g.bank.particles[temp.x].remove = remove;
  }

  perf.stop('_factory.init');
  // TODO: detect and handle shortages
}

function remove() { perf.start('_factory.obj.remove');
  $g.whichBank[this.className];
  $g.bank[`${this.className.toLowerCase()}s`].push(this);
  delete $g.game[$g.whichBank[this.className]][this.id];
  return perf.stop('_factory.obj.remove');
}

function get(bankName, initialObj = {}) {perf.start('_factory.obj.get');
  temp.entity = $g.bank[bankName].pop();
  temp.entity.init(initialObj);
  perf.stop('_factory.obj.get');
  return temp.entity;
}

export default { init };
