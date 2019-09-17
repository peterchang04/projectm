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
}
init();

// pregenerated entities - save on memory allocation
const bank = {
  projectiles: [],
  asteroids: [],
  ships: [],
  particles: [],
};

const svg = {}; // see canvasSvg, the raw transfers from .svg files to canvas

const viewport = {
  pixelRatio: window.devicePixelRatio,
  pixelsPerMeter: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  update: function(viewportWidth, viewportHeight) {
    this.width = viewportWidth;
    this.height = viewportHeight;
    this.pixelWidth = viewportWidth * window.devicePixelRatio;
    this.pixelHeight = viewportHeight * window.devicePixelRatio;
    this.vwPixels = this.pixelWidth / 100;
    /*
      IMPORTANT pixelsPerMeter IS FOR ACTOR SCALE ON SCREEN
      we want to show ship scale commensurate with having 8 ships worth of forward visibility initially.
      half as much (4 ships) behind
      ship is 20 meters so 160 meters forward, 80 behind for a total screen height of 240m
    */
    this.pixelsPerMeter = this.pixelHeight / 210;
    this.pixelsPerMeter = this.pixelHeight / 240; // default
    this.pixelsPerMeter = this.pixelHeight / 300
    this.pixelsPerMeter = this.pixelHeight / 500;
    // this.pixelsPerMeter = this.pixelHeight / 800;
    // this.pixelsPerMeter = this.pixelHeight / 150;
  },
  shipPixelX: 0,
  shipPixelY: 0,
};

// set global javascript  references to these values
global.$g = { viewport, game, constants, bank, svg };

export default { constants, viewport, game, bank, svg };
