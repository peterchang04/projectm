import $g from '../../utils/globals.js';
import canvasText from '../../utils/canvasText.js';

// declarations
let canvas = null;
let context = null;
let startYPixel = 0; // the first latitude gridline to draw
let startXPixel = 0; // the first longitutde gridline to draw
let shipYPixelDist = 0;
let shipXPixelDist = 0;
let shipLAT = 0;
let shipLONG = 0;
// iterators predeclared
let i = 0;
let currentYPixel = 0;
let currentXPixel = 0;
let currentYText = '';
let currentXText = '';
// calculations
const gridDistance = 100; // meters
let gridPixels = 0; // how many pixels in between grids?
let screenGridCount = 0; // how many grids can fit on screen?

function init(width, height) {
  canvas = document.getElementById('canvas_grid');
  context = canvas.getContext('2d');
  // set canvas resolution
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;
  // set styles for lines
  context.strokeStyle = 'rgba(255, 255, 255, .1)';
  context.lineWidth = $g.viewport.vwPixels * .5;
  // do some pre calculations, assume we render twice as many lines as would fit on a screen
  gridPixels = $g.viewport.pixelsPerMeter * gridDistance;
  screenGridCount = (canvas.height - (canvas.height % gridPixels)) / gridPixels;
  screenGridCount++; // if grid bigger than screen, the count would be zero.
  // double it to represent what's drawn above, and below the ship
  screenGridCount = screenGridCount * 2;
}

let coordinates = '';
let speedText = '';
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawLatitudes();
  drawLongitudes();
  // draw coordinates for debugging
  coordinates = `(LAT ${$g.game.myShip.mX.toFixed(1)} m , LNG ${$g.game.myShip.mY.toFixed(1)} m)`;
  canvasText.draw(
    context,
    coordinates,
    $g.viewport.shipPixelX - (context.measureText(coordinates).width * $g.viewport.pixelRatio / 2),
    $g.viewport.shipPixelY + ($g.game.myShipPixelLength / 1.5)
  );
  speedText = `${$g.game.myShip.s.toFixed(1)} m/s`;
  canvasText.draw(
    context,
    speedText,
    $g.viewport.shipPixelX - (context.measureText(speedText).width * $g.viewport.pixelRatio / 2),
    $g.viewport.shipPixelY + ($g.game.myShipPixelLength / 1.5) + canvasText.getLetterHeight()
  );
}

function drawLatitudes() {
  // begin with the ship's Y.
  startYPixel = $g.viewport.shipPixelY; // we want this to be negative
  // move up by drawable grid sections
  startYPixel -= gridPixels * Math.ceil(screenGridCount / 2); // the rest of the
  // adjust by how much the ship is offset from grid section
  startYPixel += ($g.game.myShip.mY * $g.viewport.pixelsPerMeter) % gridPixels;
  currentYPixel = startYPixel;

  for (i = 0; i < screenGridCount * 2; i++) { // render double what fits on screen
    context.beginPath();
    context.moveTo(0, currentYPixel);
    context.lineTo(canvas.width, currentYPixel);
    context.stroke();
    // how far is this line from shipY?
    // calculate the text for LAT line
    shipYPixelDist = Math.abs(currentYPixel - $g.viewport.shipPixelY);
    if (currentYPixel <= $g.viewport.shipPixelY) { // line is above ship
      shipLAT = $g.game.myShip.mY + (shipYPixelDist / $g.viewport.pixelsPerMeter);
    } else { // line is below ship
      shipLAT = $g.game.myShip.mY - (shipYPixelDist / $g.viewport.pixelsPerMeter);
    }

    currentYText = `LAT ${Math.round(shipLAT).toFixed(0)} m`;
    canvasText.draw(
      context,
      currentYText,
      3*$g.viewport.pixelRatio,
      currentYPixel - canvasText.getLetterHeight() - $g.viewport.pixelRatio,
      2
    );
    currentYPixel += gridPixels;
  }
}

function drawLongitudes() {
  // begin with the ship's Y.
  startXPixel = $g.viewport.shipPixelX; // we want this to be negative
  // move up by drawable grid sections
  startXPixel -= gridPixels * Math.ceil(screenGridCount / 2); // the rest of the
  // adjust by how much the ship is offset from grid section
  startXPixel += ($g.game.myShip.mX * $g.viewport.pixelsPerMeter) % gridPixels;
  currentXPixel = startXPixel;

  for (i = 0; i < screenGridCount * 2; i++) { // render double what fits on screen
    context.beginPath();
    context.moveTo(currentXPixel, 0);
    context.lineTo(currentXPixel, canvas.height);
    context.stroke();
    // how far is this line from shipY?
    // calculate the text for LAT line
    shipXPixelDist = Math.abs(currentXPixel - $g.viewport.shipPixelX);
    if (currentXPixel <= $g.viewport.shipPixelX) { // line is above ship
      shipLONG = $g.game.myShip.mX + (shipXPixelDist / $g.viewport.pixelsPerMeter);
    } else { // line is below ship
      shipLONG = $g.game.myShip.mX - (shipXPixelDist / $g.viewport.pixelsPerMeter);
    }

    currentXText = `LNG ${Math.round(shipLONG).toFixed(0)} m`;
    canvasText.draw(
      context,
      currentXText,
      currentXPixel + $g.viewport.pixelRatio,
      canvas.height - 3*$g.viewport.pixelRatio - canvasText.getLetterHeight(),
      2
    );
    currentXPixel += gridPixels;
  }
}

export default { init, draw };
