import $g from '../../utils/globals.js';
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
  canvas.width = $g.viewport.pixelWidth * .3;
  canvas.height = $g.viewport.pixelWidth * .3; // width again because square

  myShip = new Ship();
  // register myShip with constants
  $g.game.myShip = myShip;

  // calculate the position of the ship on viewport
  $g.game.setMyShipPixelLength(canvas.height / 1.42);
  const canvasPos = canvas.getBoundingClientRect();
  $g.viewport.shipX = canvasPos.x + (canvasPos.width / 2);
  $g.viewport.shipY = canvasPos.y + (canvasPos.height / 2);
  $g.viewport.shipPixelX = $g.viewport.shipX * $g.viewport.pixelRatio;
  $g.viewport.shipPixelY = $g.viewport.shipY * $g.viewport.pixelRatio;
}

function update(parentUpdateCount) {
  stats.updateCount++;
  myShip.update(parentUpdateCount);
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  stats.drawCount++;
  stats.lastDraw = Date.now();

  myShip.draw(context);
}

export default { init, update, draw, myShip };
