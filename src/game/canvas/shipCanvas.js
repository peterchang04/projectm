import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const stats = {
  updateCount: 0,
  lastDraw: 0,
  drawCount: 0,
};
let canvas = null;
let context = null;

let svgs = {};
let temp = {};

function init() { perf.start('shipCanvas.init');
  canvas = document.getElementById('canvas_myShip');
  context = canvas.getContext('2d');

  // set canvas resolution
  canvas.width = $g.viewport.pixelsPerMeter * $g.game.myShip.length * $g.constants.SQRT2;
  canvas.height = canvas.width; // width again because square

  // set canvas width to 1.414 of ship length - so a perfectly square ship turned 45 deg can still fit
  canvas.style.width = `${canvas.width / $g.viewport.pixelRatio}px`;
  canvas.style[`margin-left`] = `-${canvas.width / 2 / $g.viewport.pixelRatio}px`; // offset to center ship on screen
  canvas.style[`margin-bottom`] = canvas.style[`margin-left`];

  const canvasPos = canvas.getBoundingClientRect();
  $g.viewport.shipX = canvasPos.x + (canvasPos.width / 2);
  $g.viewport.shipY = canvasPos.y + (canvasPos.height / 2);
  $g.viewport.shipPixelX = $g.viewport.shipX * $g.viewport.pixelRatio;
  $g.viewport.shipPixelY = $g.viewport.shipY * $g.viewport.pixelRatio;
  perf.stop('shipCanvas.init');
}

function draw() { perf.start('shipCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);

  stats.drawCount++;
  stats.lastDraw = Date.now();

  $g.game.myShip.draw(context);

  perf.stop('shipCanvas.draw');
}

export default { init, draw };
