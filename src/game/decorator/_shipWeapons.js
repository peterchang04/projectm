import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import { cloneDeep } from 'lodash';

const temp = {}; // memory pointer to avoid allocation for new variables
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  arsenal: {},
  turrets: {},
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_shipWeapons.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // more thrust eq more force (eq more speed)
  obj.fireCannon = function(type = 0) { perf.start('_shipWeapons.obj.fireCannon');
    temp.projectile = $g.bank.projectiles.pop();
    // wipe this projectile
    temp.projectile.init({
      type,
      mX: this.mX,
      mY: this.mY,
      d: this.d,
      exemptColliders: { [`${this.id}`]: this }
    });
    perf.stop('_shipWeapons.obj.fireCannon');
  };

  perf.stop('_shipWeapons.add');
}

export default { add, getProperties };
