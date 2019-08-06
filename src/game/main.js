import backgroundCanvas from './canvas/backgroundCanvas.js';
import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import shipCanvas from './canvas/shipCanvas.js';
import $g from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';
import perf from '../utils/perf.js';
import Ship from '../game/actor/ship.js';

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
  $g.game.actors[0] = new Ship({ mX: 0, mY: 0, angle: 90, d: 0 });
  $g.game.myShip = $g.game.actors[0]; // set pointer to myShip here

  // init dependencies
  canvasText.init();
  shipCanvas.init();
  backgroundCanvas.init();
  backgroundGridCanvas.init();
  steeringCanvas.init();

  // start the update loop
  clearInterval(stats.loopId);
  stats.loopId = setInterval(() => {
    update();
  }, 16.66 /* 60 fps updates */ );

  // start the draw loop;
  draw();
}

let actorKey = null; // pointer to avoid memory allocation in loop
function update() { let p = perf.start('main.update');
  stats.updateCount++;
  for (actorKey in $g.game.actors) {
    $g.game.actors[actorKey].update(stats.updateCount);
  }
  perf.stop('main.update', p);
}

// draws at the refresh rate of device monitor. Mostly 60, but could be 100+
function draw() { let p = perf.start('main.draw');
  stats.lastDraw = Date.now();
  backgroundCanvas.draw();
  backgroundGridCanvas.draw();
  shipCanvas.draw();
  steeringCanvas.draw();
  perf.stop('main.draw', p);
  requestAnimationFrame(draw);
}

export default { init };
