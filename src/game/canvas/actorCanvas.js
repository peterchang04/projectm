import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import perf from '../../utils/perf.js';
import eventManager from '../../utils/eventManager.js';

const temp = {};
let canvas = null;
let context = null;

function init() { perf.start('actorCanvas.init');
  // setup draw canvas
  canvas = document.getElementById('canvas_actors');
  context = canvas.getContext('2d');

  update();

  // listen for viewport changes
  eventManager.add(window, 'viewportUpdated.actorCanvas', (e) => { update(); });

  perf.stop('actorCanvas.init');
}

function update() { perf.start('actorCanvas.update');
  canvas.width = $g.viewport.pixelGameWidth;
  canvas.height = $g.viewport.pixelGameHeight;
  perf.stop('actorCanvas.update');
}

function draw() { perf.start('actorCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);

  Object.keys($g.game.actors).map((id) => {
    $g.game.actors[id].draw(context);
  });
  Object.keys($g.game.projectiles).map((id) => {
    $g.game.projectiles[id].draw(context);
  });
  Object.keys($g.game.particles).map((id) => {
    $g.game.particles[id].draw(context);
  });

  perf.stop('actorCanvas.draw');
}

export default { init, draw };
