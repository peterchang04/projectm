import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import { cloneDeep } from 'lodash';

const temp = {}; // memory pointer to avoid allocation for new variables
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  targets: [null, null, null, null], // up to 4 targets
  target: null, // the currently selected target, from this.targets
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_shipTargeting.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach functions
  obj.addTarget = addTarget;
  obj.removeTarget = removeTarget;
  obj.getTargetSlot = getTargetSlot;
  obj.selectTarget = selectTarget;
  obj.deselectTarget = deselectTarget;

  perf.stop('_shipTargeting.add');
}

function addTarget(id) { perf.start('_shipTargeting.obj.addTarget');
  temp.targetSlot = this.getTargetSlot();
  if (temp.targetSlot !== null && this.targets.indexOf(+id) === -1) {
    this.targets[temp.targetSlot] = +id;
  }
  return perf.stop('_shipTargeting.obj.addTarget');
}

// to preserve forward viewable space, targets are added in this order 0, 3, 1, 2
function getTargetSlot() { perf.start('_shipTargeting.obj.getTargetSlot');
  if (this.targets[0] === null) return 0;
  if (this.targets[3] === null) return 3;
  if (this.targets[1] === null) return 1;
  if (this.targets[2] === null) return 2;
  return null;
  perf.start('_shipTargeting.obj.getTargetSlot');
}

function removeTarget(id) { perf.start('_shipTargeting.obj.removeTarget');
  temp.targetIndex = this.targets.indexOf(+id);
  if (temp.targetIndex >= 0) {
    this.targets[temp.targetIndex] = null;
  }
  // also remove as target if applicable
  if (+this.target === +id) this.target === null;
  return perf.stop('_shipTargeting.obj.removeTarget');
}

function selectTarget(id) { perf.start('_shipTargeting.obj.selectTarget');
  if (this.targets.indexOf(+id) >= 0) this.target = +id;
  perf.stop('_shipTargeting.obj.selectTarget');
}

function deselectTarget(id) { perf.start('_shipTargeting.obj.deselectTarget');
  this.target = null;
  perf.stop('_shipTargeting.obj.deselectTarget');
}

export default { add, getProperties };
