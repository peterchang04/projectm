import Particle from './particle.js';
import random from '../utils/random.js';
import globals from '../utils/globals.js';

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
const canvas = {};
const context = {};

function init(width, height) {
  canvas.b = document.getElementById('canvas_background');
  context.b = canvas.b.getContext('2d');
  canvas.g = document.getElementById('canvas_grid');
  context.g = canvas.g.getContext('2d');

  // set canvas resolution
  canvas.b.width = globals.viewport.pixelWidth;
  canvas.b.height = globals.viewport.pixelHeight;
  canvas.g.width = globals.viewport.pixelwidth;
  canvas.g.height = globals.viewport.pixelHeight;

  prepopulateStars();
}

function update() {
  stats.updateCount++;
  for (const id in particles) {
    particles[id].update();
    // TODO: PERFORMANCE - recycle particles
    // TODO: PERFORMANCE - pregenerate particles as rastor
    if (isOOB(particles[id])) delete particles[id];
  }
  generateStars();
}

function draw() {
  context.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

  stats.drawCount++;
  stats.lastDraw = Date.now();
  for (const id in particles) {
    particles[id].draw(context.b);
  }
  // drawGrid();
}

function generateStars() {
  for (const mod in starSpecs) {
    if (stats.updateCount % mod === 0) {
      const p = new Particle({
        x: random.get(2000) % canvas.b.width, y: -3, d: 180,
        w: starSpecs[mod].w, s: starSpecs[mod].s,
        opacity: starSpecs[mod].opacity,
        trail: starSpecs[mod].trail
      });
      particles[p.id] = p;
    }
  }
}

function prepopulateStars() {
  for (const mod in starSpecs) {
    for (let i = 0; i < starSpecs[mod].pregen; i++) {
      const p = new Particle({
        x: random.get(2000) % canvas.b.width,
        y: random.get(2000) % canvas.b.height,
        d: 180,
        w: starSpecs[mod].w, s: starSpecs[mod].s,
        opacity: starSpecs[mod].opacity,
        trail: starSpecs[mod].trail
      });
      particles[p.id] = p;
    }
  }
}

function isOOB(particle) {
  return Boolean(
    particle.y > canvas.b.height + 5 // the most likely direction first
    || particle.x < -5
    || particle.x > canvas.b.width + 5
    || particle.y < -5
  );
}

function drawGrid() {
	// context.g.clearRect(0, 0, canvas.g.width, canvas.g.height);
}

export default { init, update, draw };
