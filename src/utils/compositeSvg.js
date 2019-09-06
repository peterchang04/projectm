import $g from './globals.js';
import perf from './perf.js';
import canvasText from './canvasText.js';
// draws an actor, but uses layering of svgs to accomplish
const canvasBank = []; // a stash of canvases to be allocated
const temp = {};

function init() { perf.start('compositeSvg.init');
  // pre-generate a load of canvases to represent all the different svg actors
  for (temp.i = 0; temp.i < 50; temp.i++) {
    temp.canvasObj = {
      canvas: document.createElement("canvas"),
      id: temp.i,
    };
    // setup canvas
    temp.canvasObj.canvas.id = temp.i;
    temp.canvasObj.canvas.style = 'width:15vw';
    temp.canvasObj.canvas.width = 142; // hypotenuse of 100x100 svg square
    temp.canvasObj.canvas.height = 142; // hypotenuse of 100x100 svg square
    temp.canvasObj.context = temp.canvasObj.canvas.getContext('2d');
    // temp.canvasObj.context.imageSmoothingEnabled = false;
    canvasBank.push(temp.canvasObj);
  }
   perf.stop('compositeSvg.init');
}

function renderComposite(entity) { perf.start('compositeSvg.renderComposite');
  entity.svgComposites.map((word) => {
    compositeFunctions[word](entity);
  });
  return perf.stop('compositeSvg.renderComposite');
}

function draw(context, entity, x, y) { perf.start('compositeSvg.draw');
  // this actor is initilaized, this obj will exist
  if (!entity.svgCompositeData) initEntity(entity);
  // if still not initialized, wait until next draw loop
  if (!entity.svgCompositeData) return perf.stop('compositeSvg.draw');

  renderComposite(entity);

  // calculate the size of the entity in pixels
  temp.pixelLength = entity.length * $g.viewport.pixelsPerMeter * $g.constants.SQRT2; // SQRT2 To get hypotenuse

  // at the end, draw final to context
  context.drawImage(
    entity.svgCompositeData.canvases[entity.svgCompositeData.drawCanvas].canvas,
    x - (temp.pixelLength * 0.5 /* offset so coordinate is center of image */), // top left X coordinate in targetContext where to paint
    y - (temp.pixelLength * 0.5 /* offset so coordinate is center of image */), // top left Y coordinate in targetContext where to paint
    /* keep in mind the canvas the canvas of rotated svg is 1.41 x wider to allow for full rotation */
    temp.pixelLength, // width of the eventual svg element
    temp.pixelLength, // height of the eventual
  );
  return perf.stop('compositeSvg.draw');
}

function initEntity(entity) { perf.start('compositeSvg.initEntity');
  // this would only work after canvasSvg has initted
  if (Object.keys($g.svg).length === 0) {
    perf.stop('compositeSvg.initEntity');
    return console.warn('waiting for canvas svg ');
  }
  if (!entity.svg) throw new Error("Entity must have property 'svg'");
  // the default layer order
  if (!entity.svgComposites) entity.svgComposites = ['rotate'];
  // always begin with 'base' layer
  entity.svgComposites.unshift('base');

  entity.svgCompositeData = {
    last: {}, // keep the "last" datapoint to base redraws on (e.g. this.d for rotate)
    canvases: {
      base: $g.svg[entity.svg],
      last: $g.svg[entity.svg], // 'last' is always where draw should pull from. After each composite 'last' will be set to the appropriate canvas
    },
    drawCanvas: 'last', // which canvas to draw. Defaults to 'last'
  };

  // go through each composite layer and draw
  entity.svgComposites.map((word) => {
    compositeFunctions[word](entity);
  });
  perf.stop('compositeSvg.initEntity');
}

const compositeFunctions = {
  base: function (entity) { perf.start('compositeSvg.render.base');
    // simply set 'last canvas as base, that way the next layer (if any) can pick up from there
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.base;
    perf.stop('compositeSvg.render.base');
  },
  rotate: function(entity) { perf.start('compositeSvg.render.rotate');
    // skip if it is myship - don't assign to last so it is skipped as a draw step
    if (entity.id == $g.game.myShip.id) return perf.stop('compositeSvg.render.rotate');

    // assign a canvas from bank
    if (!entity.svgCompositeData.canvases.rotate) entity.svgCompositeData.canvases.rotate = canvasBank.pop();

    // figure out the angle to draw the svg relative to myShip
    temp.d = entity.d - $g.game.myShip.d;

    // see if a redraw is needed
    if (entity.svgCompositeData.last.d === temp.d) {
      // no redraw necessary, simplay set to 'last' to maintain draw order
      entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.rotate;
      return perf.stop('compositeSvg.render.rotate');
    }
    // update redraw check
    entity.svgCompositeData.last.d = temp.d;

    // draw rotated canvas
    // get the rotated context for drawing
    entity.svgCompositeData.canvases.rotate.context.setTransform(1, 0, 0, 1, 0, 0);
    entity.svgCompositeData.canvases.rotate.context.clearRect(0, 0, entity.svgCompositeData.canvases.rotate.canvas.width, entity.svgCompositeData.canvases.rotate.canvas.height);
    entity.svgCompositeData.canvases.rotate.context.translate(entity.svgCompositeData.canvases.rotate.canvas.width/2, entity.svgCompositeData.canvases.rotate.canvas.height/2);
    entity.svgCompositeData.canvases.rotate.context.rotate(temp.d * $g.constants.RADIAN);
    entity.svgCompositeData.canvases.rotate.context.drawImage(
      entity.svgCompositeData.canvases.last.canvas, // from previous canvas
      -entity.svgCompositeData.canvases.rotate.canvas.width/2,
      -entity.svgCompositeData.canvases.rotate.canvas.width/2
    );
    // set to 'last' to maintain draw order
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.rotate;
    perf.stop('compositeSvg.render.rotate');
  },
  target: function(entity) { perf.start('compositeSvg.render.target');
    // skip if it is myship - don't assign to last so it is skipped as a draw step
    if (entity.id == $g.game.myShip.id) return perf.stop('compositeSvg.render.target');

    // assign a canvas from bank
    if (!entity.svgCompositeData.canvases.targetingOnly) entity.svgCompositeData.canvases.targetingOnly = canvasBank.pop(); // draw the targeting interface here. Needs no-redraw if not updated
    if (!entity.svgCompositeData.canvases.target) entity.svgCompositeData.canvases.target = canvasBank.pop();

    temp.isTarget = ($g.game.myShip.targets.indexOf(+entity.id) >= 0);
    temp.isSelected = ($g.game.myShip.target === entity.id);

    entity.svgCompositeData.canvases.target.context.clearRect(0, 0, entity.svgCompositeData.canvases.target.canvas.width, entity.svgCompositeData.canvases.target.canvas.height);

    // see if a redraw is needed
    if (entity.svgCompositeData.last.isTarget === temp.isTarget && entity.svgCompositeData.last.isSelected === temp.isSelected) {
      // copy the last canvas over
      // now copy the last canvas over
      entity.svgCompositeData.canvases.target.context.drawImage(
        entity.svgCompositeData.canvases.last.canvas, // from previous canvas
        0, 0
      );
      // now overlay with ready-drawn interface
      entity.svgCompositeData.canvases.target.context.drawImage(
        entity.svgCompositeData.canvases.targetingOnly.canvas, // from previous canvas
        0, 0
      );
      entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.target;
      return perf.stop('compositeSvg.render.target');;
    }

    // update redraw check
    entity.svgCompositeData.last.isTarget = temp.isTarget;
    entity.svgCompositeData.last.isSelected = temp.isSelected;
    entity.svgCompositeData.canvases.target.context.clearRect(0, 0, entity.svgCompositeData.canvases.target.canvas.width, entity.svgCompositeData.canvases.target.canvas.height);
    entity.svgCompositeData.canvases.targetingOnly.context.clearRect(0, 0, entity.svgCompositeData.canvases.targetingOnly.canvas.width, entity.svgCompositeData.canvases.targetingOnly.canvas.height);
    if (temp.isTarget) {
      // solve for line-width. Longer the entity.length the bigger the canvas and the smaller the width should be
      temp.lineWidth = (24 / $g.viewport.pixelRatio) * (20 / entity.length);

      // draw a rect around border of canvas
      entity.svgCompositeData.canvases.targetingOnly.context.beginPath();
      entity.svgCompositeData.canvases.targetingOnly.context.rect(
        temp.lineWidth + (entity.svgCompositeData.canvases.targetingOnly.canvas.width * (entity.length * 0.05 / 100)),
        temp.lineWidth + (entity.svgCompositeData.canvases.targetingOnly.canvas.height * (entity.length * 0.05 / 100)),
        ((1 - (entity.length * 0.1 / 100)) * entity.svgCompositeData.canvases.targetingOnly.canvas.width) - (temp.lineWidth * 2),
        ((1 - (entity.length * 0.1 / 100)) * entity.svgCompositeData.canvases.targetingOnly.canvas.height) - (temp.lineWidth * 2)
      );
      entity.svgCompositeData.canvases.targetingOnly.context.lineWidth = temp.lineWidth;
      if (temp.isSelected) {
        // nothing to do so far
      }
      entity.svgCompositeData.canvases.targetingOnly.context.strokeStyle = (temp.isSelected) ? "#00c4ffDD" : "rgba(255, 255, 255, .1)";
      entity.svgCompositeData.canvases.targetingOnly.context.stroke();
      // now use clearRect to make it look like brackets
      entity.svgCompositeData.canvases.targetingOnly.context.clearRect(
        (temp.lineWidth * entity.length / 6), // x-start
        0, // start outside of canvas
        entity.svgCompositeData.canvases.targetingOnly.canvas.width - (temp.lineWidth * entity.length / 3), // width
        entity.svgCompositeData.canvases.targetingOnly.canvas.height // height
      );
      entity.svgCompositeData.canvases.targetingOnly.context.clearRect(
        0, // x-start
        (temp.lineWidth * entity.length / 6), // start outside of canvas
        entity.svgCompositeData.canvases.targetingOnly.canvas.width, // width
        entity.svgCompositeData.canvases.targetingOnly.canvas.height - (temp.lineWidth * entity.length / 3) // height
      );
    }

    // now copy the last canvas over
    entity.svgCompositeData.canvases.target.context.drawImage(
      entity.svgCompositeData.canvases.last.canvas, // from previous canvas
      0, 0
    );
    // now layer it with the targeting interface
    entity.svgCompositeData.canvases.target.context.drawImage(
      entity.svgCompositeData.canvases.targetingOnly.canvas, // from previous canvas
      0, 0
    );
    // set to 'last' to maintain draw order
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.target;
    return perf.stop('compositeSvg.render.target');
  },
};

export default { init, draw, renderComposite };
