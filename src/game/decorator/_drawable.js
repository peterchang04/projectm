import globals from '../../utils/globals.js';

let id = 0;

function add(obj) {
  obj.id = globals.game.newId();
  if (!obj.c) obj.c = '#fff';
  obj.updates = [];
  obj.draws = [];
  obj.update = function () {
    if (!obj.updates.length) return;

    obj.updates.forEach((word) => {
      // console.log(obj.id, word, obj);
      obj[word]();
    });
  };
  obj.draw = function(context) {
    if (!obj.draws.length) return;

    obj.draws.forEach((word) => {
      obj[word](context);
    });
  };
}

export default { add };
