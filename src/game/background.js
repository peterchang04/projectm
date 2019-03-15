import Particle from './particle.js';

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

  stats.width = width;
  stats.height = height;

  // set canvas resolution
  canvas.b.width = width;
  canvas.b.height = height;

  // add test particles
  const p1 = new Particle({ x: 110, y: 310, w: 15, s: .01, d: 45, a: .01 });
  const p2 = new Particle({ x: 170, y: 170, w: 5, s: .015, d: 150 });
  particles[p1.id] = p1;
  particles[p2.id] = p2;
}

function update(speed = 0, direction = 0) {
  // generate particles as if moving forward


  stats.updateCount++;
  for (const id in particles) {
    particles[id].update();
  }
}

function draw() {
  stats.drawCount++;
  stats.lastDraw = Date.now();
	context.b.clearRect(0, 0, canvas.b.width, canvas.b.height);

  for (const id in particles) {
    particles[id].draw(context.b);
  }
}

export default { init, update, draw };
