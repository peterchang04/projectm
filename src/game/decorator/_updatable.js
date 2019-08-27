import $g from '../../utils/globals.js';
import { cloneDeep } from 'lodash';
import perf from '../../utils/perf.js';

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

function add(obj) { perf.start('_updatable.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions to obj
  obj.addUpdate = addUpdate;
  obj.removeUpdate = removeUpdate;
  obj.update = update;
  perf.stop('_updatable.add');
}

// mechanism to add update functions to object
function addUpdate(name, priority = 1 /* priority 1 runs first */, frameSkip = 1 /* frameSkip = 1 runs every frame */) { perf.start('_updatable.addUpdate');
  this.updatesByName[name] = { name, priority, frameSkip };
  // calculate offset to stagger execution
  this.updatesByName = calculateFrameSkipOffset(this.updatesByName);
  // sorty by priority
  this.updatesSorted = sortUpdates(this.updatesByName);
  // file into simple map for looping
  this.updates = this.updatesSorted.map((item) => {
    return item.name;
  });
  perf.stop('_updatable.addUpdate');
};
// mechanism to remove update functions from object
function removeUpdate(name) { perf.start('_updatable.removeUpdate');
  delete this.updatesByName[name];
  // calculate offset to stagger execution
  this.updatesByName = calculateFrameSkipOffset(this.updatesByName);
  // sorty by priority
  this.updatesSorted = sortUpdates(this.updatesByName);
  // file into simple map for looping
  this.updates = this.updatesSorted.map((item) => {
    return item.name;
  });
  perf.stop('_updatable.removeUpdate');
};

// the per actor update call
function update(stats) { perf.start('_updatable.update');
  this.updates.map((word) => {
    if (this.updatesByName[word].frameSkip > 1) {
      temp.equality = this.updatesByName[word].frameSkipOffset || 0 % this.updatesByName[word].frameSkip;
      if ((stats.updateCount + this.id) % this.updatesByName[word].frameSkip !== temp.equality) return perf.stop('_updatable.update');;
    }
    this[word]((stats.now - stats.update[this.updatesByName[word].frameSkip]) / 1000);
  });
  perf.stop('_updatable.update');
};

// sorts the raw updates by priority
function sortUpdates(updatesByName) { perf.start('_updatable.sortUpdates');
  temp.updatesSorted = [];
  // file raw updatesByName into the array
  Object.keys(updatesByName).map((key) => {
    temp.updatesSorted.push(updatesByName[key]);
  });
  // sort the array by priority
  temp.updatesSorted.sort(function(a, b) {
    return a.priority - b.priority;
  });
  perf.stop('_updatable.sortUpdates');
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

export default { add, getProperties };
