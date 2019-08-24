import $g from '../../utils/globals.js';

let id = 0;
const temp = {};

function add(obj = {}) {
   // coordinates to draw at
  if (obj.mX === undefined) obj.mX = 0;
  if (obj.mY === undefined) obj.mY = 0;

  obj.id = $g.game.newId();
  obj.temp = {}; // for temp calculations

  obj.updates = []; // the list of updates to
  obj.updatesByName = {};
  obj.updatesSorted = [];

  // mechanism to add update functions to object
  obj.addUpdate = function(name, priority = 1 /* priority 1 runs first */, frameSkip = 1 /* frameSkip = 1 runs every frame */) {
    this.updatesByName[name] = { name, priority, frameSkip };
    // calculate offset to stagger execution
    this.updatesByName = calculateFrameSkipOffset(this.updatesByName);
    // sorty by priority
    this.updatesSorted = sortUpdates(this.updatesByName);
    // file into simple map for looping
    this.updates = this.updatesSorted.map((item) => {
      return item.name;
    });
  };
  // mechanism to remove update functions from object
  obj.removeUpdate = function(name) {
    delete this.updatesByName[name];
    // calculate offset to stagger execution
    this.updatesByName = calculateFrameSkipOffset(this.updatesByName);
    // sorty by priority
    this.updatesSorted = sortUpdates(this.updatesByName);
    // file into simple map for looping
    this.updates = this.updatesSorted.map((item) => {
      return item.name;
    });
  };

  // sorts the raw updates by priority
  function sortUpdates(updatesByName) {
    temp.updatesSorted = [];
    // file raw updatesByName into the array
    Object.keys(updatesByName).map((key) => {
      temp.updatesSorted.push(updatesByName[key]);
    });
    // sort the array by priority
    temp.updatesSorted.sort(function(a, b) {
      return a.priority - b.priority;
    });
    return temp.updatesSorted;
  };

  // for each frameskip set, offset and increment to stagger execution, this way, all functions with offset 4 will be staggered
  function calculateFrameSkipOffset(updatesByName) {
    temp.frameSkipCounter = {};
    Object.keys(updatesByName).map((key) => {
      if (updatesByName[key].frameSkip > 1) {
        if (!temp.frameSkipCounter[updatesByName[key].frameSkip]) temp.frameSkipCounter[updatesByName[key].frameSkip] = 0; // initialize array
        // increment frameSkipCounter;
        temp.frameSkipCounter[updatesByName[key].frameSkip]++;
        updatesByName[key].frameSkipOffset = temp.frameSkipCounter[updatesByName[key].frameSkip];
      }
    });
    return updatesByName;
  };

  // the per actor update call
  obj.update = function (stats) {
    obj.updates.map((word) => {
      if (obj.updatesByName[word].frameSkip > 1) {
        temp.equality = obj.updatesByName[word].frameSkipOffset || 0 % obj.updatesByName[word].frameSkip;
        if ((stats.updateCount + obj.id) % obj.updatesByName[word].frameSkip !== temp.equality) return;
      }
      obj[word]((stats.now - stats.update[obj.updatesByName[word].frameSkip]) / 1000);
    });
  };

  obj.drawsByName = {};
  obj.drawsSorted = [];
  obj.draws = [];

  obj.addDraw = function(name, priority = 1 /* priority 1 runs first */, canvasId = null /* specify which canvas to call on */) {
    this.drawsByName[name] = { name, priority, canvasId };
    // sorty by priority
    this.drawsSorted = sortDraws(this.drawsByName);
    this.draws = this.drawsSorted.map((item) => {
      return item.name;
    });
  };
  obj.removeDraw = function(name) {
    delete this.drawsByName[name];
    // sorty by priority
    this.drawsSorted = sortDraws(this.drawsByName);
    this.draws = this.drawsSorted.map((item) => {
      return item.name;
    });
  }

  // the draw calls, in sorted order
  obj.draw = function(context) {
    obj.draws.forEach((word) => {
      // see if a canvas has been specified
      if (obj.drawsByName[word].canvasId && obj.drawsByName[word].canvasId !== context.canvas.id) return;
      context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate before every draw
      obj[word](context);
    });
  };

  // sorts the draws by priority
  function sortDraws(drawsByName) {
    // file raw updatesByName into the array
    temp.drawsSorted = Object.keys(drawsByName).map((key) => {
      return drawsByName[key];
    });
    // sort the array by priority
    temp.drawsSorted.sort(function(a, b) {
      return a.priority - b.priority;
    });
    return temp.drawsSorted;
  };
}

export default { add };
