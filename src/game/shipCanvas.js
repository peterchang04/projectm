import globals from '../utils/globals.js';
import Ship from './ship.js';

const stats = {
  updateCount: 0,
  lastDraw: 0,
  drawCount: 0,
};
let canvas = null;
let context = null;

let svgs = {};
let myShip = null;

function init() {
  canvas = document.getElementById('canvas_myShip');
  context = canvas.getContext('2d');

  // set canvas resolution
  canvas.width = globals.viewport.pixelWidth * .2;
  canvas.height = globals.viewport.pixelWidth * .2; // width again because square

  myShip = new Ship();
  // register myShip with constants
  globals.game.myShip = myShip;
}


function update(speed = 0, direction = 0) {
  stats.updateCount++;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  stats.drawCount++;
  stats.lastDraw = Date.now();

  myShip.draw(context);
}

export default { init, update, draw, myShip };
