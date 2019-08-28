const constants = {
  DEBUG: false,
  DRAWCOLLISION: false,
  // precalc these to save computations
  PI2: Math.PI * 2,
  RADIAN: Math.PI / 180,
  SQRT2: Math.sqrt(2),
};

// game related values NOTE: maybe these belong somewhere in /game instead
const game = {
  actors: {}, // all actors here. myShip = [0]
  projectiles: {},
  particles: {},
  id: 0,
  newId: function() {
    return this.id++;
  },
};

// pregenerated entities - save on memory allocation
const bank = {
  projectiles: [],
  asteroids: [],
  ships: [],
  particles: [],
};

const whichBank = { // given a classname, which queue does it belong in?
  Asteroid: 'actors',
  Ship: 'actors',
  Projectile: 'projectiles',
  Particle: 'particles',
};

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
      we want to show ship scale commensurate with having 7 ships worth of forward visibility initially.
      half as much (3.5 ships) behind
      ship is 30 meters so 210 meters forward, 105 behind for a total screen height of 315m
    */
    this.pixelsPerMeter = this.pixelHeight / 315;
  },
  shipPixelX: 0,
  shipPixelY: 0,
};

// set global javascript  references to these values
global.$g = { viewport, game, constants, bank, whichBank };

export default { constants, viewport, game, bank, whichBank };
