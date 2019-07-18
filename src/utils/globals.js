const constants = {
  DEBUG: false,
  PI2: Math.PI * 2,
  RADIAN: Math.PI / 180,
};

// game related values
const game = {
  myShip: null, // mX, mY
  id: 0,
  myShipPixelLength: 0,
  newId: function() {
    return this.id++;
  },
  setMyShipPixelLength: function(length) {
    this.myShipPixelLength = length;
    // calculate pixel per meter for navigation
    viewport.pixelsPerMeter = this.myShipPixelLength / this.myShip.length;
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
  },
  shipX: 0,
  shipY: 0,
  shipPixelX: 0,
  shipPixelY: 0,
};

// set global javascript  references to these values
global.$g = { viewport, game, constants };

export default { constants, viewport, game };
