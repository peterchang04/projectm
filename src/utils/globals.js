const constants = {
  DEBUG: false,
  PI2: Math.PI * 2,
  RADIAN: Math.PI / 180,
};

// game related values NOTE: maybe these belong somewhere in /game instead
const game = {
  actors: { 0: null }, // all actors here. myShip = [0]
  id: 0,
  newId: function() {
    return this.id++;
  },
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
  shipX: 0,
  shipY: 0,
  shipPixelX: 0,
  shipPixelY: 0,
};

// set global javascript  references to these values
global.$g = { viewport, game, constants };

export default { constants, viewport, game };
