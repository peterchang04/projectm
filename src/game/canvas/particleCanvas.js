import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import perf from '../../utils/perf.js';

const temp = {};
let canvas = null;
let context = null;

function init() { perf.start('particleCanvas.init');
  // setup draw canvas
  canvas = document.getElementById('canvas_particles');
  context = canvas.getContext('2d');
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;

  perf.stop('particleCanvas.init');
}

function draw() { perf.start('particleCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys($g.game.particles).map((id) => {
    $g.game.particles[id].draw(context);
  });

  perf.stop('particleCanvas.draw');
}

export default { init, draw };
