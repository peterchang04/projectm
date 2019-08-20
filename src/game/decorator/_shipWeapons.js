// translates ship settings (throttle, energy settings, into physics outputs)
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import _factory from '../actor/_factory.js';
import Projectile from '../actor/projectile.js';


const temp = {}; // memory pointer to avoid allocation for new variables

function add(obj) { perf.start('_shipWeapons.add');
  // more thrust eq more force (eq more speed)
  obj.fireCannon = function(type = 0) { perf.start('_shipWeapons.obj.fireCannon');
    temp.projectile = _factory.getProjectile({
      type,
      mX: obj.mX,
      mY: obj.mY,
      d: obj.d,
    });
    $g.game.actors[temp.projectile.id] = temp.projectile;
    perf.stop('_shipWeapons.obj.fireCannon');
  };

  // register update functions
  // obj.updates.push('someFunction');

  perf.stop('_shipWeapons.add');
}

export default { add };
