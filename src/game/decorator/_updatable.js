import $g from '../../utils/globals.js';
import { cloneDeep } from 'lodash';

const temp = {};
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  updatesByName: {}, // definitions of update methods, with priority
  updatesSorted: [], // a step in creating obj.updates
  updates: [], // sorted execution list of update methods
};

function getProperties() {
  return properties;
}

function add(obj) {
  Object.assign(obj, cloneDeep(properties)); // merge properties

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
    this.updates.map((word) => {
      if (this.updatesByName[word].frameSkip > 1) {
        temp.equality = this.updatesByName[word].frameSkipOffset || 0 % this.updatesByName[word].frameSkip;
        if ((stats.updateCount + this.id) % this.updatesByName[word].frameSkip !== temp.equality) return;
      }
      this[word]((stats.now - stats.update[this.updatesByName[word].frameSkip]) / 1000);
    });
  };
}

export default { add, getProperties };
