import $g from '../../utils/globals.js';

let id = 0;

function add(obj = {}) {
  obj.id = $g.game.newId();
  obj.temp = {};
  if (!obj.c) obj.c = '#fff';
  obj.updates = [];
  obj.draws = [];
  obj.update = function (updateCount = -1) {
    obj.updates.forEach((word) => {
      obj[word](updateCount);
    });
  };
  obj.draw = function(context) {
    obj.draws.forEach((word) => {
      obj[word](context);
    });
  };
}

export default { add };
