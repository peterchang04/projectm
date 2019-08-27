import { cloneDeep } from 'lodash';
import perf from '../../utils/perf.js';
const temp = {};

/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  callbacks: {}, // for a property, maintain a list of callbacks to trigger if it gets updated
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_settersAndHooks.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions
  obj.onUpdate = addOnUpdate; // named differently on obj to be easier to use.
  obj.set = set;
  perf.stop('_settersAndHooks.add');
}

/* Vue hook allow for callbacks to be added for triggering on change */
function addOnUpdate(key, name /*name this update*/, func, overwrite = false) { perf.start('_settersAndHooks.obj.addOnUpdate');
  // first item? create {}
  if (!this.callbacks[key]) this.callbacks[key] = {};
  // set function if it doesn't exist already
  if (overwrite || !this.callbacks[key][name]) this.callbacks[key][name] = func;

  perf.stop('_settersAndHooks.obj.addOnUpdate');
}

function set(key, value) { perf.start('_settersAndHooks.obj.set');
  // do nothing if no value update
  if (this[key] === value) return;
  if (this.callbacks[key]) {
    Object.keys(this.callbacks[key]).map((funcName) => {
      // call the stored callback
      this.callbacks[key][funcName](
        value, // the new value (haven't updated yet)
        this[key], // the old value
        this, // reference to obj
      );
    });
  }
  // now set the value
  this[key] = value;
  perf.stop('_settersAndHooks.obj.set');
}

export default { add, getProperties };
