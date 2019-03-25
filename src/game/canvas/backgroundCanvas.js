import Particle from '../actor/particle.js';
import random from '../../utils/random.js';
import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';

const starSpecs = {
  15: { w: 1, s: .01, opacity: .3, trail: 0, pregen: 60 },
  32: { w: 1, s: .05, opacity: .8, trail: 2, pregen: 20 },
  64: { w: 2, s: .15, opacity: 1, trail: 5, pregen: 5 },
};

const stats = {
  updateCount: 0,
  lastDraw: 0,
  drawCount: 0,
};
const particles = {};
let canvas = null;
let context = null;

function init() { let p = perf.start('backgroundCanvas.init');

  canvas = document.getElementById('canvas_background');
  context = canvas.getContext('2d');

  // set canvas resolution
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;

  prepopulateStars();
  perf.stop('backgroundCanvas.init', p);
}

function update() { let p = perf.start('backgroundCanvas.update');
  // return;
  stats.updateCount++;
  for (const id in particles) {
    particles[id].update();
    // TODO: PERFORMANCE - recycle particles
    // TODO: PERFORMANCE - pregenerate particles as rastor
    if (isOOB(particles[id])) delete particles[id];
  }
  generateStars();
  perf.stop('backgroundCanvas.update', p);
}

function draw() { let p = perf.start('backgroundCanvas.draw');
  // return;
  stats.drawCount++;
  stats.lastDraw = Date.now();
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const id in particles) {
    particles[id].draw(context);
  }
  perf.stop('backgroundCanvas.draw', p);
}

function generateStars() { let p = perf.start('backgroundCanvas.generateStars');
  for (const mod in starSpecs) {
    if (stats.updateCount % mod === 0) {
      const p = new Particle({
        x: random.get(2000) % canvas.width, y: -3, d: 180,
        w: starSpecs[mod].w, s: starSpecs[mod].s,
        opacity: starSpecs[mod].opacity,
        trail: starSpecs[mod].trail
      });
      particles[p.id] = p;
    }
  }
  perf.stop('backgroundCanvas.generateStars', p);
}

function prepopulateStars() { let p = perf.start('backgroundCanvas.prepopulateStars');
  for (const mod in starSpecs) {
    for (let i = 0; i < starSpecs[mod].pregen; i++) {
      const p = new Particle({
        x: random.get(2000) % canvas.width,
        y: random.get(2000) % canvas.height,
        d: 180,
        w: starSpecs[mod].w, s: starSpecs[mod].s,
        opacity: starSpecs[mod].opacity,
        trail: starSpecs[mod].trail
      });
      particles[p.id] = p;
    }
  }
  perf.stop('backgroundCanvas.prepopulateStars', p);
}

let isOOBResult = null;
function isOOB(particle) { let p = perf.start('backgroundCanvas.isOOB');
  isOOBResult = Boolean(
    particle.y > canvas.height + 5 // the most likely direction first
    || particle.x < -5
    || particle.x > canvas.width + 5
    || particle.y < -5
  );
  perf.stop('backgroundCanvas.isOOB', p);
  return isOOBResult;
}

export default { init, update, draw };
