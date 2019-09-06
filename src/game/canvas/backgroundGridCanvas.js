import $g from '../../utils/globals.js';
import canvasText from '../../utils/canvasText.js';
import perf from '../../utils/perf.js';

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
const gridDistance = 1000; // meters
let gridPixels = 0; // how many pixels in between grids?
let screenGridCount = 0; // how many grids can fit on screen?

function init(width, height) { perf.start('backgroundGridCanvas.init');
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
  screenGridCount = screenGridCount * 4;
  perf.stop('backgroundGridCanvas.init');
}

let coordinates = '';
let speedText = '';
function draw() { perf.start('backgroundGridCanvas.draw');
  context.setTransform(1, 0, 0, 1, 0, 0); // restore context
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw coordinates for debugging
  // coordinates = `(LAT ${$g.game.myShip.mX.toFixed(1)} m , LNG ${$g.game.myShip.mY.toFixed(1)} m)`;
  // canvasText.draw(
  //   context,
  //   coordinates,
  //   $g.viewport.shipPixelX - (context.measureText(coordinates).width * $g.viewport.pixelRatio / 2),
  //   $g.viewport.shipPixelY + (($g.viewport.pixelsPerMeter * 30) / 1.5)
  // );
  // speedText = `${$g.game.myShip.d.toFixed(1)}° ${$g.game.myShip.s.toFixed(1)} m/s ${$g.game.myShip.aS.toFixed(1)} deg/s`;
  // canvasText.draw(
  //   context,
  //   speedText,
  //   $g.viewport.shipPixelX - (context.measureText(speedText).width * $g.viewport.pixelRatio / 2),
  //   $g.viewport.shipPixelY + (($g.viewport.pixelsPerMeter * 30) / 1.5) + canvasText.getLetterHeight()
  // );

  applyRotation(context);
  drawLatitudes();
  drawLongitudes();

  context.setTransform(1, 0, 0, 1, 0, 0); // restore context
  perf.stop('backgroundGridCanvas.draw');
}

function applyRotation(context) { perf.start('backgroundGridCanvas.applyRotation');
  context.translate($g.viewport.shipPixelX, $g.viewport.shipPixelY);
  context.rotate(-$g.game.myShip.d * $g.constants.RADIAN);
  perf.stop('backgroundGridCanvas.applyRotation');
}

function drawLatitudes() { perf.start('backgroundGridCanvas.drawLatitudes');
  // begin with the ship's Y.
  startYPixel = $g.viewport.shipPixelY; // we want this to be negative
  // move up by drawable grid sections
  startYPixel -= gridPixels * Math.ceil(screenGridCount / 2); // the rest of the
  // adjust by how much the ship is offset from grid section
  startYPixel += ($g.game.myShip.mY * $g.viewport.pixelsPerMeter) % gridPixels;
  currentYPixel = startYPixel;

  for (i = 0; i < screenGridCount * 2; i++) { // render double what fits on screen
    context.beginPath();
    context.moveTo(
      // x coordinate
      0 - ($g.viewport.pixelWidth / 2) // begin line offscreen
      - canvas.width, // rotational transform offset
      // y coordinate
      currentYPixel - $g.viewport.shipPixelY
    );
    context.lineTo(
      // x coordinate
      canvas.width * 2 // end offscreen
      - $g.viewport.shipPixelY,
      // y coordinate
      currentYPixel - $g.viewport.shipPixelY
    );
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
  perf.stop('backgroundGridCanvas.drawLatitudes');
}

function drawLongitudes() { perf.start('backgroundGridCanvas.drawLongitudes');
  // begin with the ship's Y.
  startXPixel = $g.viewport.shipPixelX; // we want this to be negative
  // move up by drawable grid sections
  startXPixel -= gridPixels * Math.ceil(screenGridCount / 2); // the rest of the
  // adjust by how much the ship is offset from grid section
  startXPixel -= ($g.game.myShip.mX * $g.viewport.pixelsPerMeter) % gridPixels;
  currentXPixel = startXPixel;

  for (i = 0; i < screenGridCount * 2; i++) { // render double what fits on screen
    context.beginPath();
    context.moveTo(
      // x coordinate
      currentXPixel - $g.viewport.shipPixelX,
      // y coordinate
      0 - canvas.height // begin off screen
      - $g.viewport.shipPixelY // rotation transform offset
    );
    context.lineTo(
      // x coordinate
      currentXPixel - $g.viewport.shipPixelX,
      // y coordinate
      canvas.height * 2 // end offscreen
      - $g.viewport.shipPixelY // rotation transform offset
    );
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
  perf.stop('backgroundGridCanvas.drawLongitudes');
}

export default { init, draw };
