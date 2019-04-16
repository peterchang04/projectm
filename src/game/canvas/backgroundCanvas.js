const DEBUG = false;
import Particle from '../actor/particle.js';
import random from '../../utils/random.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const v = { // file scope
  temp: {},
  particles: {},
  updateCount: 0,
  lastDraw: 0,
  drawCount: 0,
  starSpecs: { // width in vW for consistency
    15: { w: 1, opacity: .3, trail: 0, count: 240 },
    32: { w: 1, opacity: .8, trail: 2, count: 80 },
    64: { w: 2, opacity: 1, trail: 5, count: 20 },
  }
};

const particles = {};

function init() { let p = perf.start('backgroundCanvas.init');
/*
  The viewable canvas will utilize hypotenuse sided squares (seen below)
  Square have width of the hypotenuse of the larger of 2 dimensions
  This way the shipView can fit rotated 45deg comfortably in the center of its own background square.
  We always draw 4 background squares, as the ship moves away from center of a background square,
  (as seen below) we would need to draw ahead 3 other hypotenuse squares to create the illusion
  of stars in every direction, which three depends on where the viewscreen is centered.
      _______________
   1  |    |  d |  d |
      |____|____|____| each square can be identified by a (qX, qY) with the upper left corner of
   0  |    |  s |  d | (0, 0) matching mX:0, mY:0 (meter coordinates)
      |____|____|____|
  -1  |    |    |    |
      |____|____|____|
       -1     0    1

  The pregenerated canvas also uses the hypotenuse sided squares. Though a total of 4 squares
  are drawn. This way there are 4 possible star source arrangements to copy from.
  A simple algorithm ensures that for any given qX, qY the same pregen square will be used.
*/

  // setup draw canvas
  v.canvas = document.getElementById('canvas_background');
  v.context = v.canvas.getContext('2d');
  v.canvas.width = $g.viewport.pixelWidth;
  v.canvas.height = $g.viewport.pixelHeight;

  // create a prerender canvas
  v.resourceCanvas = document.createElement("canvas");
  v.resourceContext = v.resourceCanvas.getContext('2d');
  v.resourceCanvas.id = 'resourceCanvas';

  v.hypot = 1.42 * (($g.viewport.width > $g.viewport.height) ? $g.viewport.width : $g.viewport.height);
  v.hypotPixels = v.hypot * $g.viewport.pixelRatio;
  // 2x2 grid of stars to copy from
  v.resourceCanvas.width = 2 * v.hypotPixels;
  v.resourceCanvas.height = 2 * v.hypotPixels;

  if (DEBUG) {
    v.shipView = document.getElementById('shipView');
    v.resourceCanvas.style = "width:100%;position:fixed;left:0;top:0;";
    v.shipView.appendChild(v.resourceCanvas);
  }

prepopulateStars();
  perf.stop('backgroundCanvas.init', p);
}

function update() { let p = perf.start('backgroundCanvas.update');
  perf.stop('backgroundCanvas.update', p);
}

function draw() { let p = perf.start('backgroundCanvas.draw');
  v.drawCount++;
  v.lastDraw = Date.now();
  // figure out the current quadrant [origin, horizNeighbor, vertNeigbor, diagnal]
  drawStars();

  perf.stop('backgroundCanvas.draw', p);
}

function drawStars(scale = .5) {
  v.context.clearRect(0, 0, v.canvas.width, v.canvas.height);
  // get the current meter coordinate in pixels (from 0,0)
  v.temp.mXPixels = $g.game.myShip.mX * $g.viewport.pixelsPerMeter;
  v.temp.remainderXPixels = (v.temp.mXPixels * scale) % v.hypotPixels;
  // solve for sqX, which identifies the current square (0, 0) from center
  v.temp.sqX = ((v.temp.mXPixels - v.temp.remainderXPixels) * scale) / v.hypotPixels;
  if ($g.game.myShip.mX < 0) v.temp.sqX -= 1; // 1st quadrant below 0 should be -1


  // now Y axis
  v.temp.mYPixels = $g.game.myShip.mY * $g.viewport.pixelsPerMeter;
  v.temp.remainderYPixels = (v.temp.mYPixels) % (v.hypotPixels * scale);
  v.temp.sqY = ((v.temp.mYPixels - v.temp.remainderYPixels) * scale) / v.hypotPixels;
  console.log(v.temp.sqX, v.temp.sqY);
  if ($g.game.myShip.mY < 0) v.temp.sqY -= 1; // 1st quadrant below 0 should be -1

  // position in quadrant - will determine whith other quadrants to draw
  if (v.temp.remainderXPixels > 0) {
    v.temp.quadrantXPercent = v.temp.remainderXPixels / (v.hypotPixels * scale);
    v.temp.quadrantXOriginPixelDelta = -v.temp.remainderXPixels;
  } else { // negatives formula is different
    v.temp.quadrantXPercent = (v.hypotPixels + v.temp.remainderXPixels) / (v.hypotPixels * scale);
    v.temp.quadrantXOriginPixelDelta = -(v.hypotPixels + v.temp.remainderXPixels);
  }
  if (v.temp.remainderYPixels > 0) {
    v.temp.quadrantYPercent = v.temp.remainderYPixels / (v.hypotPixels * scale);
    v.temp.quadrantYOriginPixelDelta = -(v.hypotPixels - v.temp.remainderYPixels);
  } else { // negatives formula is different
    v.temp.quadrantYPercent = (v.hypotPixels + v.temp.remainderYPixels) / (v.hypotPixels * scale);
    v.temp.quadrantYOriginPixelDelta = v.temp.remainderYPixels;
  }
  v.context.translate($g.viewport.shipPixelX, $g.viewport.shipPixelY);
  v.context.rotate(-$g.game.myShip.d * $g.constants.RADIAN);

  // ORIGINAL QUADRANT
  v.context.drawImage(
    v.resourceCanvas,
    (v.temp.sqX % 2 === 0) ? 0 : v.resourceCanvas.width / 2,
    (v.temp.sqY % 2 === 0) ? 0 : v.resourceCanvas.height / 2,
    v.resourceCanvas.width / 2,
    v.resourceCanvas.height / 2,
    v.temp.quadrantXOriginPixelDelta,
    v.temp.quadrantYOriginPixelDelta,
    v.hypotPixels,
    v.hypotPixels
  );

  // HORIZ NEIGHBOR
  v.temp.qXHorizNeighbor = (v.temp.quadrantXPercent > .5) ? v.temp.sqX+1 : v.temp.sqX-1;
  v.temp.horizNeighborSource = getSourceByQuadrant(v.temp.qXHorizNeighbor, v.temp.sqY);
  v.context.drawImage(
    v.resourceCanvas,
    v.temp.horizNeighborSource.sourceX,
    v.temp.horizNeighborSource.sourceY,
    v.resourceCanvas.width / 2,
    v.resourceCanvas.height / 2,
    v.temp.quadrantXOriginPixelDelta + ((v.temp.quadrantXPercent > .5) ? v.hypotPixels : -v.hypotPixels),
    v.temp.quadrantYOriginPixelDelta,
    v.hypotPixels,
    v.hypotPixels
  );

  // VERT NEIGHBOR
  v.temp.qYVerticalNeighbor = (v.temp.quadrantXPercent > .5) ? v.temp.sqY+1 : v.temp.sqY-1;
  v.temp.vertNeighborSource = getSourceByQuadrant(v.temp.sqX, v.temp.qYVerticalNeighbor);
  v.context.drawImage(
    v.resourceCanvas,
    v.temp.vertNeighborSource.sourceX,
    v.temp.vertNeighborSource.sourceY,
    v.resourceCanvas.width / 2,
    v.resourceCanvas.height / 2,
    v.temp.quadrantXOriginPixelDelta,
    v.temp.quadrantYOriginPixelDelta + ((v.temp.quadrantYPercent > .5) ? -v.hypotPixels : v.hypotPixels),
    v.hypotPixels,
    v.hypotPixels
  );

  // DIAGONAL
  v.temp.diagNeighborSource = getSourceByQuadrant(v.temp.qXHorizNeighbor, v.temp.qYVerticalNeighbor);
  v.context.drawImage(
    v.resourceCanvas,
    v.temp.diagNeighborSource.sourceX,
    v.temp.diagNeighborSource.sourceY,
    v.resourceCanvas.width / 2,
    v.resourceCanvas.height / 2,
    v.temp.quadrantXOriginPixelDelta + ((v.temp.quadrantXPercent > .5) ? v.hypotPixels : -v.hypotPixels),
    v.temp.quadrantYOriginPixelDelta + ((v.temp.quadrantYPercent > .5) ? -v.hypotPixels : v.hypotPixels),
    v.hypotPixels,
    v.hypotPixels
  );

  // restore context back to normal
  v.context.setTransform(1, 0, 0, 1, 0, 0);
}

function getSourceByQuadrant(qX, qY) {
  // given a quadrant (x,y) always render the same source set of stars
  return {
    sourceX: (qX % 2 === 0) ? 0 : v.resourceCanvas.width / 2,
    sourceY: (qY % 2 === 0) ? 0 : v.resourceCanvas.height / 2
  };
}

function prepopulateStars() { let p = perf.start('backgroundCanvas.prepopulateStars');
  for (v.temp.i = 0; v.temp.i < 200; v.temp.i++) {
    v.temp.particleX = random.get(5000) % v.resourceCanvas.width;
    v.temp.particleY = random.get(5000) % v.resourceCanvas.height;
    v.temp.c = '#fff';
    if (v.temp.particleX > v.resourceCanvas.width / 2) {
      if (v.temp.particleY > v.resourceCanvas.width / 2) {
        v.temp.c = '#00FF00';
      } else {
        v.temp.c = '#0000FF';
      }
    } else {
      if (v.temp.particleY > v.resourceCanvas.width / 2) {
        v.temp.c = '#FF0000';
      }
    }

    v.resourceContext.fillStyle = v.temp.c || '#fff';
    v.resourceContext.beginPath();
    v.resourceContext.arc(
      v.temp.particleX, // x
      v.temp.particleY, // y
      .8 * $g.viewport.vwPixels / 2, // in vW radius / 2 for diameter
      0, // start radian
      $g.constants.PI2 // end radian
    );
    v.resourceContext.fill();
  }
  perf.stop('backgroundCanvas.prepopulateStars', p);
}

export default {
  init, update, draw
};
