const constants = {
  DEBUG: false,
  PI2: Math.PI * 2,
  RADIAN: Math.PI / 180,
};

// game related values
const game = {
  myShip: null,
  id: 0,
  newId: function() {
    return this.id++;
  }
};

const viewport = {
  pixelRatio: window.devicePixelRatio,
  viewportWidth: 0,
  viewportHeight: 0,
  update: function(viewportWidth, viewportHeight) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.pixelWidth = viewportWidth * window.devicePixelRatio;
    this.pixelHeight = viewportHeight * window.devicePixelRatio;
    this.vwPixels = this.pixelWidth / 100;
  }
};

export default { constants, viewport, game };
