import $g from './globals.js';
// draws an actor, but uses layering of svgs to accomplish
const canvasBank = []; // a stash of canvases to be allocated
const temp = {};

function init() {
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
    canvasBank.push(temp.canvasObj);
  }
}

function draw(context, entity, x, y) {
  // this actor is initilaized, this obj will exist
  if (!entity.svgCompositeData) initEntity(entity);
  // if still not initialized, wait until next draw loop
  if (!entity.svgCompositeData) return;

  entity.svgComposites.map((word) => {
    compositeFunctions[word](entity);
  });

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
}

function initEntity(entity) {
  // this would only work after canvasSvg has initted
  if (Object.keys($g.svg).length === 0) {
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
}

const compositeFunctions = {
  base: function (entity) {
    // simply set 'last canvas as base, that way the next layer (if any) can pick up from there
    entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.base;
  },
  rotate: function(entity) {
    // skip if it is myship - don't assign to last so it is skipped as a draw step
    if (entity.id == $g.game.myShip.id) return;

    // assign a canvas from bank
    if (!entity.svgCompositeData.canvases.rotate) entity.svgCompositeData.canvases.rotate = canvasBank.pop();

    // figure out the angle to draw the svg relative to myShip
    temp.d = entity.d - $g.game.myShip.d;

    // see if a redraw is needed
    if (entity.svgCompositeData.last.d === temp.d) {
      // no redraw necessary, simplay set to 'last' to maintain draw order
      entity.svgCompositeData.canvases.last = entity.svgCompositeData.canvases.rotate;
      return;
    }
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
  }
};

export default { init, draw };
