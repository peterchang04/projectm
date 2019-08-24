import backgroundCanvas from './canvas/backgroundCanvas.js';
import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import shipCanvas from './canvas/shipCanvas.js';
import actorCanvas from './canvas/actorCanvas.js';
import projectileCanvas from './canvas/projectileCanvas.js';
import $g from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';
import perf from '../utils/perf.js';
import Ship from '../game/actor/ship.js';
import Projectile from '../game/actor/projectile.js';
import Asteroid from '../game/actor/asteroid.js';
import _factory from '../game/actor/_factory.js';

const stats = {
  updateCount: 0,
  lastDraw: null, // epoch ms from Date.now()
  renderCount: 0,
  lastUpdated: Date.now(),
  // keep track of the timings for previous 10 frames - will be shifted down per update
  update: {
    1: Date.now(),
    2: Date.now(),
    3: Date.now(),
    4: Date.now(),
    5: Date.now(),
    6: Date.now(),
    7: Date.now(),
    8: Date.now(),
    9: Date.now(),
    10: Date.now(),
    11: Date.now(),
    12: Date.now(),
  },
};
const temp = {};

$g.game.actors = {};
$g.game.projectiles = {};
$g.game.particles = {};

function init() {
  // get the shipView's dimensions
  $g.viewport.update(document.getElementById('shipView').offsetWidth, document.getElementById('shipView').offsetHeight);

  // register myShip with constants
  $g.game.myShip = new Ship({ type: 0, mX: 0, mY: 0, d: 0 });
  $g.game.actors[$g.game.myShip.id] = $g.game.myShip;

  // init dependencies
  canvasText.init();
  shipCanvas.init();
  actorCanvas.init();
  backgroundCanvas.init();
  backgroundGridCanvas.init();
  projectileCanvas.init();
  steeringCanvas.init();
  _factory.init();

  // PLACEHOLDER - initialize 3 asteroids
  temp.asteroid0 = _factory.getAsteroid({ length: 100, mX: 100, mY: 100, d: 0, sMax: 0, aS: 30 });
  $g.game.actors[temp.asteroid0.id] = temp.asteroid0;
  // temp.asteroid1 = _factory.getAsteroid({ length: 20, mX: 100, mY: 100, d: -12, sMax: 5, aS: 15 });
  // $g.game.actors[temp.asteroid1.id] = temp.asteroid1;
  // temp.asteroid2 = _factory.getAsteroid({ length: 50, mX: -70, mY: -50, d: 5, sMax: 10, aS: -35  });
  // $g.game.actors[temp.asteroid2.id] = temp.asteroid2;
  // temp.asteroid3 = _factory.getAsteroid({ length: 60, mX: .10, mY: 100, d: 0, sMax: 10, aS: -80  });
  // $g.game.actors[temp.asteroid3.id] = temp.asteroid3;
  // for (let i = 0; i < 12; i++) {
  //   temp.asteroidX = _factory.getAsteroid({
  //     length: Math.floor(Math.random() * 75) + 5,
  //     mX: Math.floor(Math.random() * 400) - 200,
  //     mY: Math.floor(Math.random() * 400) - 200,
  //     d: -85,
  //     sMax: Math.floor(Math.random() * 15) + 3,
  //     aS: Math.floor(Math.random() * 100) - 50
  //   });
  //   $g.game.actors[temp.asteroidX.id] = temp.asteroidX;
  // }

  // start the update loop
  clearInterval(global.loopId);
  global.loopId = setInterval(() => {
    // console.log(temp.asteroid1.mX, temp.asteroid1.mY);
    update();
  }, 16.66 /* 60 fps updates */ );

  // start the draw loop;
  draw();
}

function update() { perf.start('main.update');;
  stats.updateCount++;
  stats.now = Date.now();
  stats.elapsed = (stats.now - stats.lastUpdated) / 1000; // in seconds

  // shift the last 10 frames' timings
  stats.update[12] = stats.update[11];
  stats.update[11] = stats.update[10]
  stats.update[10] = stats.update[9];
  stats.update[9] = stats.update[8];
  stats.update[8] = stats.update[7];
  stats.update[7] = stats.update[6];
  stats.update[6] = stats.update[5];
  stats.update[5] = stats.update[4];
  stats.update[4] = stats.update[3];
  stats.update[3] = stats.update[2];
  stats.update[2] = stats.update[1];
  stats.update[1] = stats.lastUpdated;

  // update all actors
  for (temp.actorKey in $g.game.actors) {
    $g.game.actors[temp.actorKey].update(stats);
  }
  for (temp.objectId in $g.game.projectiles) {
    $g.game.projectiles[temp.objectId].update(stats);
  }

  stats.lastUpdated = stats.now;
  perf.stop('main.update');
}

// draws at the refresh rate of device monitor. Mostly 60, but could be 100+
function draw() { perf.start('main.draw');
  stats.lastDraw = Date.now();
  stats.renderCount++;

  backgroundCanvas.draw();
  backgroundGridCanvas.draw();
  shipCanvas.draw();
  actorCanvas.draw();
  steeringCanvas.draw();
  projectileCanvas.draw();

  perf.stop('main.draw');
  requestAnimationFrame(draw);
}

/* REFERENCE FOR UPDATES FREQUENCIES
every X updates : results in X fps : frame ever Xms
  1 : 60fps : 17ms
  2 : 30fps : 32ms
  3 : 20fps : 50ms
  4 : 15fps : 67ms
  5 : 12fps : 83ms
  6 : 10fps : 100ms
  10: 6fps : 167ms
  12: 5fps : 200ms
  15: 4fps : 250ms
  30: 2fps : 500ms
*/

export default { init };
