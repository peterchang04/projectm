import backgroundCanvas from './canvas/backgroundCanvas.js';
import backgroundGridCanvas from './canvas/backgroundGridCanvas.js';
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
  canvasText.init();
  shipCanvas.init();
  backgroundCanvas.init();
  backgroundGridCanvas.init();

  // start the update loop
  stats.loopId = setInterval(() => {
    stats.frame++;
    update();
  }, 16.66 /* 60fps updates */ );

  // start the draw loop;
  draw();
}

function update() {
  if (!document.hasFocus) {
    console.warn('document lost focus');
    return;
  }
  backgroundCanvas.update();
  shipCanvas.update();
}

function draw() { // draws at the refresh rate of device monitor. Mostly 60, but could be 100+
  stats.lastDraw = Date.now();
  backgroundCanvas.draw();
  backgroundGridCanvas.draw();
  shipCanvas.draw();
  requestAnimationFrame(draw);
}

export default { init };
