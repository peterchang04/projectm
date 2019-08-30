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

  $g.viewport.shipPixelX = $g.viewport.pixelWidth / 2;
  $g.viewport.shipPixelY = $g.viewport.pixelHeight * (2/3);

  perf.stop('actorCanvas.init');
}

function draw() { perf.start('actorCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys($g.game.actors).map((id) => {
    $g.game.actors[id].draw(context);
  });

  perf.stop('actorCanvas.draw');
}

export default { init, draw };
