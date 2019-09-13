import $g from './globals.js';
import perf from './perf.js';
import canvasText from './canvasText.js';
import { turretTypes } from '../definitions.js';
// draws an actor, but uses layering of svgs to accomplish
const canvasBank = []; // a stash of canvases to be allocated
const temp = {};

// for each entity rendered using composite svg. has an array of render layers as steps e.g. ['damage', 'turrets', 'rotate', 'target']
// each layer will copy form the previous layer, then assign itself as the 'last' layer.
// some layers, like damage, would only update itself when changes are made
// if a layer makes and update, all subsequent layers also have to redraw
// at the end of the layers, we have a 'last' that is a composite of all the layesr before it.

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

function renderComposite(entity, update = false) { perf.start('compositeSvg.renderComposite');
  entity.svgCompositeData.update = update; // each cycle it starts as false; Unless it's the initial time
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
  renderComposite(entity, true);
  perf.stop('compositeSvg.initEntity');
}

const compositeFunctions = {
  base: function (entity) { perf.start('compositeSvg.render.base');
    // simply set 'last canvas as base, that way the next layer (if any) can pick up from there
    // base entity is directly from svg, so no assignment from canvasBank needed
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
    if (entity.svgCompositeData.last.d === temp.d && !entity.svgCompositeData.update /* a previous layer made update - redraw needed */) {
      // no redraw necessary, simply set to 'last' to maintain draw order
      entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.rotate;
      return perf.stop('compositeSvg.render.rotate');
    }
    // update redraw check
    entity.svgCompositeData.last.d = temp.d;
    entity.svgCompositeData.update = true;

    // draw rotated canvas
    // get the rotated context for drawing
    entity.svgCompositeData.canvases.rotate.context.setTransform(1, 0, 0, 1, 0, 0);
    entity.svgCompositeData.canvases.rotate.context.clearRect(0, 0, entity.svgCompositeData.canvases.rotate.canvas.width, entity.svgCompositeData.canvases.rotate.canvas.height);
    entity.svgCompositeData.canvases.rotate.context.translate(entity.svgCompositeData.canvases.rotate.canvas.width/2, entity.svgCompositeData.canvases.rotate.canvas.height/2);
    entity.svgCompositeData.canvases.rotate.context.rotate(temp.d * $g.constants.RADIAN);
    entity.svgCompositeData.canvases.rotate.context.drawImage(
      entity.svgCompositeData.canvases.last.canvas, // from previous canvas
      -entity.svgCompositeData.canvases.rotate.canvas.width/2,
      -entity.svgCompositeData.canvases.rotate.canvas.height/2
    );
    // set to 'last' to maintain draw order
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.rotate;
    perf.stop('compositeSvg.render.rotate');
  },
  target: function(entity) { perf.start('compositeSvg.render.target');
    // skip if it is myship - don't assign to last so it is skipped as a draw step
    if (entity.id == $g.game.myShip.id) return perf.stop('compositeSvg.render.target');

    // assign a canvas(es) from bank
    if (!entity.svgCompositeData.canvases.targetingOnly) entity.svgCompositeData.canvases.targetingOnly = canvasBank.pop(); // draw the targeting interface here. Needs no-redraw if not updated
    if (!entity.svgCompositeData.canvases.target) entity.svgCompositeData.canvases.target = canvasBank.pop();

    temp.isTarget = ($g.game.myShip.targets.indexOf(+entity.id) >= 0);
    temp.isSelected = ($g.game.myShip.target === entity.id);

    // see if a redraw of target interface is necessary
    if (entity.svgCompositeData.last.isTarget !== temp.isTarget || entity.svgCompositeData.last.isSelected !== temp.isSelected) {
      // set the update flag so future draws will know to update
      entity.svgCompositeData.update = true;
      // update redraw check
      entity.svgCompositeData.last.isTarget = temp.isTarget;
      entity.svgCompositeData.last.isSelected = temp.isSelected;
      // clear targeting canvas
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
    }

    // now copy the layers if update has happened
    if (entity.svgCompositeData.update) {
      entity.svgCompositeData.canvases.target.context.clearRect(0, 0, entity.svgCompositeData.canvases.target.canvas.width, entity.svgCompositeData.canvases.target.canvas.height);
      // now copy the last canvas over
      entity.svgCompositeData.canvases.target.context.drawImage(
        entity.svgCompositeData.canvases.last.canvas, // from previous canvas
        0, 0, // coordinates of destination
        // scale for destination
        entity.svgCompositeData.canvases.target.canvas.width,
        entity.svgCompositeData.canvases.target.canvas.height,
      );
      // now layer it with the targeting interface
      entity.svgCompositeData.canvases.target.context.drawImage(
        entity.svgCompositeData.canvases.targetingOnly.canvas, // from previous canvas
        0, 0, // destination coord
        // scale for destination
        entity.svgCompositeData.canvases.target.canvas.width,
        entity.svgCompositeData.canvases.target.canvas.height,
      );
    }

    // set to 'last' to maintain draw order
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.target;
    return perf.stop('compositeSvg.render.target');
  },
  turrets: function(entity) { perf.start('compositeSvg.render.turrets');
    // assign a canvas(es) from bank
    if (!entity.svgCompositeData.canvases.turretsOnly) entity.svgCompositeData.canvases.turretsOnly = canvasBank.pop(); // draw the targeting interface here. Needs no-redraw if not updated
    if (!entity.svgCompositeData.canvases.turrets) entity.svgCompositeData.canvases.turrets = canvasBank.pop();

    // see if turrets have changed
    temp.turretsUpdated = entity.svgCompositeData.update;
    entity.turrets.map((turret, i) => {
      if (entity.svgCompositeData.last[`turretDirection_${i}`] !== turret.d) temp.turretsUpdated = true;
    });

    // update turretsOnly layer
    if (temp.turretsUpdated) {
      // clear turrets only canvas
      entity.svgCompositeData.canvases.turretsOnly.context.clearRect(0, 0, entity.svgCompositeData.canvases.turretsOnly.canvas.width, entity.svgCompositeData.canvases.turretsOnly.canvas.height);
      entity.turrets.map((turret, i) => {
        // solve for size of relative to ship
        temp.turretPixels = (turretTypes[turret.type].length / entity.length) * 142;
        // get the turret svg
        temp.svg = $g.svg[turretTypes[turret.type].svg];

        // rotate the turret independently
        temp.svg.context_rotate.setTransform(1, 0, 0, 1, 0, 0);
        temp.svg.context_rotate.clearRect(0, 0, temp.svg.canvas_rotate.width, temp.svg.canvas_rotate.height);
        temp.svg.context_rotate.translate(temp.svg.canvas_rotate.width/2, temp.svg.canvas_rotate.height/2);
        temp.svg.context_rotate.rotate(turret.d * $g.constants.RADIAN);
        temp.svg.context_rotate.drawImage(
          temp.svg.canvas, // from previous canvas
          -temp.svg.canvas.width/2,
          -temp.svg.canvas.height/2
        );

        // solve for turret placement relative to ship.length
        temp.distX = turret.x;
        temp.distY = -turret.y;
        entity.svgCompositeData.canvases.turretsOnly.context.drawImage(
          temp.svg.canvas_rotate,
          (entity.svgCompositeData.canvases.turretsOnly.canvas.width / 2) + temp.distX - (temp.turretPixels * 0.5),
          (entity.svgCompositeData.canvases.turretsOnly.canvas.height / 2) + temp.distY - (temp.turretPixels * 0.5),
          temp.turretPixels,
          temp.turretPixels,
        );
        // set turrent last
        entity.svgCompositeData.last[`turretDirection_${i}`] = turret.d;
      });
      // set updated
      entity.svgCompositeData.update = true;
    }

    // see if update happened
    if (entity.svgCompositeData.update) {
      // clear turrets layer
      entity.svgCompositeData.canvases.turrets.context.clearRect(0, 0, entity.svgCompositeData.canvases.turrets.canvas.width, entity.svgCompositeData.canvases.turrets.canvas.height);
      // copy from last
      entity.svgCompositeData.canvases.turrets.context.drawImage(
        entity.svgCompositeData.canvases.last.canvas, // from previous canvas
        0, 0, // destination coord
        // scane for destination
        entity.svgCompositeData.canvases.turrets.canvas.width,
        entity.svgCompositeData.canvases.turrets.canvas.height,
      );
      // copy from turretsOnly
      entity.svgCompositeData.canvases.turrets.context.drawImage(
        entity.svgCompositeData.canvases.turretsOnly.canvas, // from previous canvas
        0, 0, // destination coord
        // scane for destination
        entity.svgCompositeData.canvases.turrets.canvas.width,
        entity.svgCompositeData.canvases.turrets.canvas.height,
      );
    }

    // set 'last' to maintain draw order
    // set to 'last' to maintain draw order
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.turrets;
    return perf.stop('compositeSvg.render.turrets');
  }
};

export default { init, draw, renderComposite };
