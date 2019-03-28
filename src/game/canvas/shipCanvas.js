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

function init() { let p = perf.start('shipCanvas.init');
  canvas = document.getElementById('canvas_myShip');
  context = canvas.getContext('2d');

  // set canvas resolution
  canvas.width = $g.viewport.pixelWidth * .3;
  canvas.height = $g.viewport.pixelWidth * .3; // width again because square

  // calculate the position of the ship on viewport
  $g.game.setMyShipPixelLength(canvas.height / 1.42);
  const canvasPos = canvas.getBoundingClientRect();
  $g.viewport.shipX = canvasPos.x + (canvasPos.width / 2);
  $g.viewport.shipY = canvasPos.y + (canvasPos.height / 2);
  $g.viewport.shipPixelX = $g.viewport.shipX * $g.viewport.pixelRatio;
  $g.viewport.shipPixelY = $g.viewport.shipY * $g.viewport.pixelRatio;
  perf.stop('shipCanvas.init', p);
}

function update(parentUpdateCount) { let p = perf.start('shipCanvas.update');
  stats.updateCount++;
  $g.game.myShip.update(parentUpdateCount);
  perf.stop('shipCanvas.update', p);
}

function draw() { let p = perf.start('shipCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);

  stats.drawCount++;
  stats.lastDraw = Date.now();

  $g.game.myShip.draw(context);
  perf.stop('shipCanvas.draw', p);
}

export default { init, update, draw };
