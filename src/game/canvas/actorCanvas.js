import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import perf from '../../utils/perf.js';

const temp = {};
let canvas = null;
let context = null;

function init() { perf.start('actorCanvas.init');
  // setup draw canvas
  canvas = document.getElementById('canvas_actors');
  context = canvas.getContext('2d');
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;

  perf.stop('actorCanvas.init');
}

function draw() { perf.start('actorCanvas.draw');
  context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate
  context.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys($g.game.actors).forEach((id) => {
    $g.game.actors[id].draw(context);
  });

  perf.stop('actorCanvas.draw');
}

export default { init, draw };
