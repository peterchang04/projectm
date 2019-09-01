import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import actorCanvas from './canvas/actorCanvas.js';
import projectileCanvas from './canvas/projectileCanvas.js';
import particleCanvas from './canvas/particleCanvas.js';
import starCanvas from './canvas/starCanvas.js';
import $g from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';
import perf from '../utils/perf.js';
import Ship from '../game/actor/ship.js';
import Projectile from '../game/actor/projectile.js';
import Asteroid from '../game/actor/asteroid.js';
import _factory from '../game/actor/_factory.js';
import decorate from '../game/decorator/decorate.js';

const temp = {};
const stats = {
  updateCount: 0,
  lastDraw: null, // epoch ms from Date.now()
  renderCount: 0,
  lastUpdated: Date.now(),
  // keep track of the timings for previous 10 frames - will be shifted down per update
  updateFrameCount: 12, // how many previou timings to keep track of
  update: {}, // previous frame timings
};
// keep track the the previous timings - will be shifted down per update
for (temp.i = 1; temp.i <= stats.updateFrameCount; temp.i++) {
  stats.update[temp.i] = Date.now();
}

function incrementFramesUpdated() {
  stats.updateCount++;
  stats.now = Date.now();
  stats.elapsed = (stats.now - stats.lastUpdated) / 1000; // in seconds
  // shift the last X frames' timings
  for (temp.i = stats.updateFrameCount; temp.i >= 2; /* frame 1 is manually updated */ temp.i--) {
    stats.update[temp.i] = stats.update[temp.i-1];
  }
  stats.update[1] = stats.lastUpdated;
}

function init() {
  // get the gameView's dimensions
  $g.viewport.update(document.getElementById('shipView').offsetWidth, document.getElementById('shipView').offsetHeight);

  _factory.init();
  // register myShip with constants
  $g.game.myShip = $g.bank.ships.shift();
  $g.game.myShip.init({ type: 0, mX: 0, mY: 0, d: 0 });

  // init dependencies
  canvasText.init();
  actorCanvas.init();
  backgroundGridCanvas.init();
  projectileCanvas.init();
  particleCanvas.init();
  steeringCanvas.init();
  starCanvas.init();

  // PLACEHOLDER - initialize 3 asteroids
  temp.asteroid0 = $g.bank.asteroids.pop();
  temp.asteroid0.init({ length: 100, mX: 100, mY: 100, d: 0, sMax: 0, aS: 0 });
  temp.asteroid1 = $g.bank.asteroids.pop();
  temp.asteroid1.init({ length: 20, mX: -100, mY: 100, d: -12, sMax: 5, aS: 15 });
  temp.asteroid2 = $g.bank.asteroids.pop();
  temp.asteroid2.init({ length: 40, mX: 0, mY: 100, d: 0, sMax: 3, aS: -6 });

  // start the update loop
  clearInterval(global.loopId); // for hot reloads (development), prevents double timing
  global.loopId = setInterval(() => {
    update();
  }, 16.66 /* 60 fps updates */ );

  // start the draw loop;
  draw();
}

function update() { perf.start('main.update');;
  incrementFramesUpdated();

  // update all actors
  for (temp.actorKey in $g.game.actors) {
    $g.game.actors[temp.actorKey].update(stats);
  }
  for (temp.objectId in $g.game.projectiles) {
    $g.game.projectiles[temp.objectId].update(stats);
  }
  for (temp.objectId in $g.game.particles) {
    $g.game.particles[temp.objectId].update(stats);
  }

  stats.lastUpdated = stats.now;
  perf.stop('main.update');
}

// draws at the refresh rate of device monitor. Mostly 60, but could be 100+
function draw() { perf.start('main.draw');
  stats.lastDraw = Date.now();
  stats.renderCount++;

  backgroundGridCanvas.draw();
  actorCanvas.draw();
  steeringCanvas.draw();
  projectileCanvas.draw();
  particleCanvas.draw();
  starCanvas.draw();

  perf.stop('main.draw');
  requestAnimationFrame(draw);
}

export default { init };
