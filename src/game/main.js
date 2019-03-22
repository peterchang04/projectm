import backgroundCanvas from './canvas/backgroundCanvas.js';
import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
import steeringCanvas from './canvas/steeringCanvas.js';
import shipCanvas from './canvas/shipCanvas.js';
import globals from '../utils/globals.js';
import canvasText from '../utils/canvasText.js';

const stats = {
  updateCount: 0,
  lastDraw: null, // epoch ms from Date.now()
  renderCount: 0,
};

const actors = {};
const bullets = {};
const canvas = {};

function init() {
  // get the shipView's dimensions
  globals.viewport.update(document.getElementById('shipView').offsetWidth, document.getElementById('shipView').offsetHeight);

  // identify canvases
  canvas.ships = document.getElementById('canvas_ships').getContext('2d');
  canvas.bullets = document.getElementById('canvas_bullets').getContext('2d');

  // init dependencies
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

function update() {
  stats.updateCount++;
  backgroundCanvas.update(stats.updateCount);
  shipCanvas.update(stats.updateCount);
}

function draw() { // draws at the refresh rate of device monitor. Mostly 60, but could be 100+
  stats.lastDraw = Date.now();
  backgroundCanvas.draw();
  backgroundGridCanvas.draw();
  shipCanvas.draw();
  steeringCanvas.draw();
  requestAnimationFrame(draw);
}

export default { init };
