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
  starSpecs: {
    15: { w: 1, s: .01, opacity: .3, trail: 0, count: 240 },
    32: { w: 1, s: .05, opacity: .8, trail: 2, count: 80 },
    64: { w: 2, s: .15, opacity: 1, trail: 5, count: 20 },
  }
};

const particles = {};

function init() { let p = perf.start('backgroundCanvas.init');
  // setup draw canvas
  v.canvas = document.getElementById('canvas_background');
  v.context = v.canvas.getContext('2d');
  v.canvas.width = $g.viewport.pixelWidth;
  v.canvas.height = $g.viewport.pixelHeight;

  // create a prerender canvas
  v.resourceCanvas = document.createElement("canvas");
  v.resourceContext = v.resourceCanvas.getContext('2d');
  v.resourceCanvas.id = 'resourceCanvas';
  v.canvas.width = $g.viewport.pixelWidth;
  v.canvas.height = $g.viewport.pixelHeight;
  if ($g.constants.DEBUG) {
    v.shipView = document.getElementById('shipView');
    v.resourceCanvas.style = "width:100%;position:fixed;left:0;top:0;";
    v.shipView.appendChild(v.resourceCanvas);
  }

  /* A grid of 4 screens
    as square made of the larger of 2 dimensions
    so it could be rotated for more variety */
  v.hypot = 1.42 * (($g.viewport.width > $g.viewport.height) ? $g.viewport.width : $g.viewport.height);
  v.hypotPixels = v.hypot * $g.viewport.pixelRatio;
  v.resourceCanvas.width = 2 * v.hypot;
  v.resourceCanvas.height = 2 * v.hypot;

  prepopulateStars();
  perf.stop('backgroundCanvas.init', p);
}

function update() { let p = perf.start('backgroundCanvas.update');
  // return;
  v.updateCount++;
  for (v.temp.id in particles) {
    particles[v.temp.id].update();
    // TODO: PERFORMANCE - recycle particles
    // TODO: PERFORMANCE - pregenerate particles as rastor
    if (isOOB(particles[v.temp.id])) delete particles[v.temp.id];
  }
  generateStars();
  perf.stop('backgroundCanvas.update', p);
}

function draw() { let p = perf.start('backgroundCanvas.draw');
  v.drawCount++;
  v.lastDraw = Date.now();
  // figure out the current quadrant [origin, horizNeighbor, vertNeigbor, diagnal]
  drawQuadrants();

  perf.stop('backgroundCanvas.draw', p);
}

function drawQuadrants() {
  v.context.clearRect(0, 0, v.canvas.width, v.canvas.height);
  v.temp.mXPixels = $g.game.myShip.mX * $g.viewport.pixelsPerMeter;
  v.temp.remainderXPixels = v.temp.mXPixels % v.hypotPixels;
  v.temp.qX = (v.temp.mXPixels - v.temp.remainderXPixels) / v.hypotPixels;
  if ($g.game.myShip.mX < 0) v.temp.qX -= 1; // 1st quadrant below 0 should be -1
  v.temp.mYPixels = $g.game.myShip.mY * $g.viewport.pixelsPerMeter;
  v.temp.remainderYPixels = v.temp.mYPixels % v.hypotPixels;
  v.temp.qY = (v.temp.mYPixels - v.temp.remainderYPixels) / v.hypotPixels;
  if ($g.game.myShip.mY < 0) v.temp.qY -= 1; // 1st quadrant below 0 should be -1

  // position in quadrant - will determine whith other quadrants to draw
  if (v.temp.remainderXPixels > 0) {
    v.temp.quadrantXPercent = v.temp.remainderXPixels / v.hypotPixels;
    v.temp.quadrantXOriginPixelDelta = -v.temp.remainderXPixels;
  } else { // negatives formula is different
    v.temp.quadrantXPercent = (v.hypotPixels + v.temp.remainderXPixels) / v.hypotPixels;
    v.temp.quadrantXOriginPixelDelta = -(v.hypotPixels + v.temp.remainderXPixels);
  }
  if (v.temp.remainderYPixels > 0) {
    v.temp.quadrantYPercent = v.temp.remainderYPixels / v.hypotPixels;
    v.temp.quadrantYOriginPixelDelta = -(v.hypotPixels - v.temp.remainderYPixels);
  } else { // negatives formula is different
    v.temp.quadrantYPercent = (v.hypotPixels + v.temp.remainderYPixels) / v.hypotPixels;
    v.temp.quadrantYOriginPixelDelta = v.temp.remainderYPixels;
  }
  v.context.translate($g.viewport.shipPixelX, $g.viewport.shipPixelY);
  v.context.rotate(-$g.game.myShip.d * $g.constants.RADIAN);

  // ORIGINAL QUADRANT
  v.context.drawImage(
    v.resourceCanvas,
    (v.temp.qX % 2 === 0) ? 0 : v.resourceCanvas.width / 2,
    (v.temp.qY % 2 === 0) ? 0 : v.resourceCanvas.height / 2,
    v.resourceCanvas.width / 2,
    v.resourceCanvas.height / 2,
    v.temp.quadrantXOriginPixelDelta,
    v.temp.quadrantYOriginPixelDelta,
    v.hypotPixels,
    v.hypotPixels
  );

  // HORIZ NEIGHBOR
  v.temp.qXHorizNeighbor = (v.temp.quadrantXPercent > .5) ? v.temp.qX+1 : v.temp.qX-1;
  v.temp.horizNeighborSource = getSourceByQuadrant(v.temp.qXHorizNeighbor, v.temp.qY);
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
  v.temp.qYVerticalNeighbor = (v.temp.quadrantXPercent > .5) ? v.temp.qY+1 : v.temp.qY-1;
  v.temp.vertNeighborSource = getSourceByQuadrant(v.temp.qX, v.temp.qYVerticalNeighbor);
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

function drawQuadrant(qX, qY) {
  v.context.translate(svg[id].canvas_rotate.width / 2, svg[id].canvas_rotate.height / 2);
  v.context.rotate(directionInt * globals.constants.RADIAN);
  v.context.setTransform(1, 0, 0, 1, 0, 0);
}

function generateStars() { let p = perf.start('backgroundCanvas.generateStars');
  for (const mod in v.starSpecs) {
    if (v.updateCount % mod === 0) {
      const p = new Particle({
        x: random.get(2000) % v.canvas.width, y: -3, d: 180,
        w: v.starSpecs[mod].w, s: v.starSpecs[mod].s,
        opacity: v.starSpecs[mod].opacity,
        trail: v.starSpecs[mod].trail
      });
      particles[p.id] = p;
    }
  }
  perf.stop('backgroundCanvas.generateStars', p);
}

function prepopulateStars() { let p = perf.start('backgroundCanvas.prepopulateStars');
  for (v.temp.spec in v.starSpecs) {
    for (v.temp.i = 0; v.temp.i < v.starSpecs[v.temp.spec].count; v.temp.i++) {
      v.temp.particleX = random.get(2000) % v.resourceCanvas.width;
      v.temp.particleY = random.get(2000) % v.resourceCanvas.height;
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
        v.starSpecs[v.temp.spec].w * $g.viewport.pixelRatio / 2, // width
        0, // start radian
        $g.constants.PI2 // end radian
      );
      v.resourceContext.fill();

      // v.temp.p = new Particle({
      //   x: ,
      //   y:,
      //   d: 180,
      //   w: v.starSpecs[v.temp.spec].w,
      //   s: v.starSpecs[v.temp.spec].s,
      //   opacity: v.starSpecs[v.temp.spec].opacity,
      //   trail: v.starSpecs[v.temp.spec].trail,
      //   c: v.temp.c
      // });
      // v.particles[v.temp.p.id] = v.temp.p;
      // v.particles[v.temp.p.id].draw(v.resourceContext);
    }
  }
  perf.stop('backgroundCanvas.prepopulateStars', p);
}

let isOOBResult = null;
function isOOB(particle) { let p = perf.start('backgroundCanvas.isOOB');
  isOOBResult = Boolean(
    particle.y > v.canvas.height + 5 // the most likely direction first
    || particle.x < -5
    || particle.x > v.canvas.width + 5
    || particle.y < -5
  );
  perf.stop('backgroundCanvas.isOOB', p);
  return isOOBResult;
}

export default {
  init, update, draw
};
