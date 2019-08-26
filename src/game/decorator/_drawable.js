import $g from '../../utils/globals.js';
import { cloneDeep } from 'lodash';

let id = 0;
const temp = {};
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

function add(obj) {
  Object.assign(obj, cloneDeep(properties)); // merge properties

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
    this.draws.forEach((word) => {
      // see if a canvas has been specified
      if (this.drawsByName[word].canvasId && this.drawsByName[word].canvasId !== context.canvas.id) return;
      context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate before every draw
      this[word](context);
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

export default { add, getProperties };
