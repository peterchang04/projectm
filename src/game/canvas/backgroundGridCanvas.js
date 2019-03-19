import $g from '../../utils/globals.js';
import canvasText from '../../utils/canvasText.js';

const gridDistance = 20; // meters
let gridPixels = 0; // how many pixels in between grids?
let canvas = null;
let context = null;
let startY = 0; // the first latitude gridline to draw
let startX = 0; // the first longitutde gridline to draw

function init(width, height) {
  canvas = document.getElementById('canvas_grid');
  context = canvas.getContext('2d');
  // set canvas resolution
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvasText.draw(
    context,
    `(LAT ${$g.game.myShip.mX.toFixed(1)} m , LNG ${$g.game.myShip.mY.toFixed(1)} m)`,
    $g.viewport.shipPixelX - ($g.game.myShipPixelLength / 2),
    $g.viewport.shipPixelY + ($g.game.myShipPixelLength / 1.5)
  );

  gridPixels = $g.viewport.pixelsPerMeter * gridDistance;
  context.strokeStyle = 'rgba(255, 255, 255, .1)';
  context.lineWidth = $g.viewport.vwPixels * .5;

  // calculate first horizontal
  startY = $g.viewport.shipPixelY % gridPixels;
  startY += ($g.game.myShip.mY * $g.viewport.pixelsPerMeter) % gridPixels;
  while (gridPixels && startY < canvas.height) {
    context.beginPath();
    context.moveTo(0, startY);
    context.lineTo(canvas.width, startY);
    context.stroke();
    startY += gridPixels;
  }

  // calculate first vertical
  startX = $g.viewport.shipPixelX % gridPixels;
  // console.log($g.game.myShip.mX, canvas.width, gridPixels);
  while (gridPixels && startX < canvas.width) {
    // console.log(startX);
    context.beginPath();
    context.moveTo(startX, 0);
    context.lineTo(startX, canvas.height);
    context.stroke();
    startX += gridPixels;
  }
}

export default { init, draw };
