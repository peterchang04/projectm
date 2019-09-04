import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import { cloneDeep } from 'lodash';

const temp = {}; // memory pointer to avoid allocation for new variables
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  targets: [], // up to 4 targets
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
  obj.selectTarget = selectTarget;
  obj.deselectTarget = deselectTarget;

  perf.stop('_shipTargeting.add');
}

// more thrust eq more force (eq more speed)
function addTarget(id) { perf.start('_shipTargeting.obj.addTarget');
  if (this.targets.indexOf(+id) === -1) this.targets.push(+id);
  console.log('add', this.targets);
  return perf.stop('_shipTargeting.obj.addTarget');
}

function removeTarget(id) { perf.start('_shipTargeting.obj.removeTarget');
  temp.targetIndex = this.targets.indexOf(+id);
  if (temp.targetIndex >= 0) {
    this.targets.splice(temp.targetIndex, 1);
  }
  // also remove as target if applicable
  if (+this.target === +id) this.target === null;
  console.log('remove', this.targets);
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
