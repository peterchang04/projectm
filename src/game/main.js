import background from './background.js';

const stats = {
  updateCount: 0,
  id: 0, // increments, each actor etc gets a new one,
  lastRender: null, // epoch ms from Date.now()
  renderCount: 0,

};
const constants = {
  RADIAN: Math.PI / 180, // precalculate radian multiplier
  fps: 40,
};
const actors = {};
const bullets = {};
const backgroundParticles = {};
const forgroundParticles = {};
const canvas = {};

function init() {
  // get the shipView's dimensions
  stats.width = document.getElementById('shipView').offsetWidth;
  stats.height = document.getElementById('shipView').offsetHeight;

  // identify canvases
  canvas.myShip = document.getElementById('canvas_myShip').getContext('2d');
  canvas.ships = document.getElementById('canvas_ships').getContext('2d');
  canvas.bullets = document.getElementById('canvas_bullets').getContext('2d');
  canvas.fore = document.getElementById('canvas_foreground').getContext('2d');

  // init dependencies
  background.init(stats.width, stats.height);

  // start the update loop
  stats.loopId = setInterval(() => {
    stats.frame++;
    update();
  }, 16.66 /* 60fps updates */ );

  // start the draw loop;
  draw();
}

function update() {
  background.update();
}

function draw() { // draws at the refresh rate of device monitor. Mostly 60, but could be 100+
  stats.lastRender = Date.now();
  background.draw(canvas.back, stats.lastRender);
  requestAnimationFrame(draw);
}

function getId() {

}

export default { init };
