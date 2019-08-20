import backgroundCanvas from './canvas/backgroundCanvas.js';
import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import shipCanvas from './canvas/shipCanvas.js';
import actorCanvas from './canvas/actorCanvas.js';
import $g from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';
import perf from '../utils/perf.js';
import Ship from '../game/actor/ship.js';
import Projectile from '../game/actor/projectile.js';
import _factory from '../game/actor/_factory.js';

const stats = {
  updateCount: 0,
  lastDraw: null, // epoch ms from Date.now()
  renderCount: 0,
};

$g.game.actors = {};
$g.game.bullets = {};

function init() {
  // get the shipView's dimensions
  $g.viewport.update(document.getElementById('shipView').offsetWidth, document.getElementById('shipView').offsetHeight);

  // register myShip with constants
  $g.game.myShip = new Ship({ mX: 0, mY: 0, angle: 90, d: 0 });

  // init dependencies
  canvasText.init();
  shipCanvas.init();
  actorCanvas.init();
  backgroundCanvas.init();
  backgroundGridCanvas.init();
  steeringCanvas.init();
  _factory.init();

  // start the update loop
  clearInterval(global.loopId);
  global.loopId = setInterval(() => {
    update();
  }, 16.66 /* 60 fps updates */ );

  // start the draw loop;
  draw();
}

// pointers to avoid memory allocation
let actorKey = null; // pointer to avoid memory allocation in loop
let lastUpdated = Date.now();
let now = null;
let elapsedSec = null;

function update() { perf.start('main.update');;
  stats.updateCount++;
  now = Date.now();
  elapsedSec = (now - lastUpdated) / 1000;

  // update myShip
  $g.game.myShip.update(elapsedSec, stats.updateCount);

  // update all actors
  for (actorKey in $g.game.actors) {
    $g.game.actors[actorKey].update(elapsedSec, stats.updateCount);
  }
  lastUpdated = now;
  perf.stop('main.update');
}

// draws at the refresh rate of device monitor. Mostly 60, but could be 100+
function draw() { perf.start('main.draw');
  stats.lastDraw = Date.now();
  backgroundCanvas.draw();
  backgroundGridCanvas.draw();
  shipCanvas.draw();
  actorCanvas.draw();
  steeringCanvas.draw();

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
