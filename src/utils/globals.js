import { getViewport } from './viewport.js';

const constants = {
  DEBUG: false,
  DRAWCOLLISION: false,
  SHOWASSETS: false,
  // precalc these to save computations
  PI2: Math.PI * 2,
  RADIAN: Math.PI / 180,
  SQRT2: Math.sqrt(2),
};

// game related values NOTE: maybe these belong somewhere in /game instead
let game = {};
let viewport = {};
function init() {
  game = {
    actors: {}, // all actors here. myShip = [0]
    projectiles: {},
    particles: {},
    id: 0,
    newId: function() {
      return this.id++;
    },
  };
  viewport = getViewport();
}
// run init already
init();

// pregenerated entities - save on memory allocation
const bank = {
  projectiles: [],
  asteroids: [],
  ships: [],
  particles: [],
};

const svg = {}; // see canvasSvg, the raw transfers from .svg files to canvas

// set global javascript  references to these values
global.$g = { viewport, game, constants, bank, svg };

export default { constants, viewport, game, bank, svg };
