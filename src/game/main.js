import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import actorCanvas from './canvas/actorCanvas.js';
import starCanvas from './canvas/starCanvas.js';
import $g from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';
import perf from '../utils/perf.js';
import Ship from '../game/actor/Ship.js';
import Projectile from '../game/actor/Projectile.js';
import Asteroid from '../game/actor/Asteroid.js';
import Torpedo from '../game/actor/Torpedo.js';
import _factory from '../game/actor/_factory.js';
import decorate from '../game/decorator/decorate.js';
import { initViewport } from '../utils/viewport.js';
import noSleep from '../utils/noSleep.js';

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
  initViewport();
  noSleep.init();

  _factory.init();
  // register myShip with constants
  $g.game.myShip = $g.bank.ships.shift();
  $g.game.myShip.init({ type: 'transportMk1', mX: -10, mY: 10, d: 3 });

  // init dependencies
  canvasText.init();
  actorCanvas.init();
  backgroundGridCanvas.init();
  steeringCanvas.init();
  starCanvas.init();

  document.addEventListener('touchmove',function (){
    document.body.scrollTop = 0
  })

  // PLACEHOLDER - initialize 3 asteroids
  // $g.bank.getAsteroid({ length: 100, mX: 50, mY: 50, d: 0, sMax: 0, aS: 0 });
  $g.bank.getAsteroid({ length: 20, mX: -0, mY: 220, d: 90, sMax: 8, aS: 15 });
  $g.bank.getAsteroid({ length: 40, mX: 0, mY: 100, d: 0, sMax: 3, aS: -6 });
  $g.bank.getAsteroid({ length: 80, mX: -30, mY: -50, d: -60, sMax: 9, aS: 52 });
  $g.bank.getAsteroid({ length: 15, mX: -300, mY: -100, d: 26, sMax: 7, aS: -32 });
  $g.bank.getAsteroid({ length: 6, mX: -600, mY: -100, d: 26, sMax: 7, aS: -32 });
  $g.bank.getAsteroid({ length: 7, mX: -500, mY: -100, d: 26, sMax: 7, aS: -32 });

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
  starCanvas.draw();

  perf.stop('main.draw');
  requestAnimationFrame(draw);
}

export default { init };
