import globals from '../../utils/globals.js';
import Ship from '../actor/ship.js';

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
  canvas.width = globals.viewport.pixelWidth * .3;
  canvas.height = globals.viewport.pixelWidth * .3; // width again because square

  myShip = new Ship();
  // register myShip with constants
  globals.game.myShip = myShip;

  // calculate the position of the ship on viewport
  globals.game.setMyShipPixelLength(canvas.height / 1.42);
  const canvasPos = canvas.getBoundingClientRect();
  globals.viewport.shipX = canvasPos.x + (canvasPos.width / 2);
  globals.viewport.shipY = canvasPos.y + (canvasPos.height / 2);
  globals.viewport.shipPixelX = globals.viewport.shipX * globals.viewport.pixelRatio;
  globals.viewport.shipPixelY = globals.viewport.shipY * globals.viewport.pixelRatio;
  console.log(globals);
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
