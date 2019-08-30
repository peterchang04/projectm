import $g from '../../utils/globals.js';
import { cloneDeep } from 'lodash';
import perf from '../../utils/perf.js';

let id = 0;
const temp = {
  pixelResult: {}, // predefining this to avoid garbage collection
};
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  mX: 0, // gameWorld mX "metersX"
  mY: 0, // gameWorld mY "metersY"
  drawsByName: {}, // definitions of draw methods, with priority
  drawsSorted: [], // a step in creating obj.draws
  draws: [], // sorted execution list of draw methods
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_drawable.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions
  obj.addDraw = addDraw;
  obj.removeDraw = removeDraw;
  obj.draw = draw;
  obj.getViewportPixel = getViewportPixel;
  perf.stop('_drawable.add');
}

function addDraw(name, priority = 1 /* priority 1 runs first */, canvasId = null /* specify which canvas to call on */) { perf.start('_drawable.addDraw');
  this.drawsByName[name] = { name, priority, canvasId };
  // sorty by priority
  this.drawsSorted = sortDraws(this.drawsByName);
  this.draws = this.drawsSorted.map((item) => {
    return item.name;
  });
  perf.stop('_drawable.addDraw');
};

function removeDraw(name) { perf.start('_drawable.removeDraw');
  delete this.drawsByName[name];
  // sorty by priority
  this.drawsSorted = sortDraws(this.drawsByName);
  this.draws = this.drawsSorted.map((item) => {
    return item.name;
  });
  perf.stop('_drawable.removeDraw');
}

// the draw calls, in sorted order
function draw(context) { perf.start('_drawable.draw');
  context.save();
  this.draws.forEach((word) => {
    // see if a canvas has been specified
    if (this.drawsByName[word].canvasId && this.drawsByName[word].canvasId !== context.canvas.id) return;
    this[word](context);
    context.restore();
  });
  perf.stop('_drawable.draw');
};

// sorts the draws by priority
function sortDraws(drawsByName) { perf.start('_drawable.sortDraws');
  // file raw updatesByName into the array
  temp.drawsSorted = Object.keys(drawsByName).map((key) => {
    return drawsByName[key];
  });
  // sort the array by priority
  temp.drawsSorted.sort(function(a, b) {
    return a.priority - b.priority;
  });
  perf.stop('_drawable.sortDraws');
  return temp.drawsSorted;
};

// given a mX and mY, output
function getViewportPixel(mX, mY, length = 10, isMyShip = false) { perf.start('_drawable.getViewportPixel');
  // solve for dist from ship
  temp.distX = mX - $g.game.myShip.mX;
  temp.distY = mY - $g.game.myShip.mY;

  // translate this point by myShip rotation (https://academo.org/demos/rotation-about-point/)
  if (isMyShip) {
    // apply no rotation because myShip is perspective
    temp.distXPrime = temp.distX;
    temp.distYPrime = temp.distY;
  } else {
    temp.distXPrime = (temp.distX * $g.game.myShip.dY) - (temp.distY * $g.game.myShip.dX);
    temp.distYPrime = (temp.distY * $g.game.myShip.dY) + (temp.distX * $g.game.myShip.dX);
  }


  temp.pixelResult.x = $g.viewport.shipPixelX + (temp.distXPrime * $g.viewport.pixelsPerMeter);
  temp.pixelResult.y = $g.viewport.shipPixelY - (temp.distYPrime * $g.viewport.pixelsPerMeter);
  // see if this is close enough to draw
  temp.pixelResult.isVisible = (
    temp.pixelResult.x > 0 - length
    && temp.pixelResult.y > 0 - length
    && temp.pixelResult.x < $g.viewport.pixelWidth + length
    && temp.pixelResult.y < $g.viewport.pixelHeight + length
  );

  perf.stop('_drawable.getViewportPixel');
  return temp.pixelResult;
}

export default { add, getProperties };
