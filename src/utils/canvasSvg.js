import canvg from 'canvg';
import $g from '../utils/globals.js';
const svg = {};
const elAssets = null;
const temp = {};
const canvases = {};
const contexts = {};
const canvasReferenceBank = [];
/*
  GIVEN AN SVG ID...
  1. <svg> is converted into text string and stored in js memory
  2. svg is translated to an canvas using canvg, stored on svg[id].canvas
    any compositing (lighting, damage textures) will be done here
    This is only redrawn when necessary
  3. for rotations, svg[id].canvas is drawn to svg[id].canvas_rotate.
    this is faster than copying from canvg every time
    This is only redrawn when svg[id].canvas changes or rotation updates
  4. draw to game canvas from canvas_rotate
*/

/*
  TO ENABLE A NEW SVG ASSET
  Import into /components/Assets.vue by svg id
*/

function init() {
  // load all assets and sort them into respective canvases
  const elAssets = document.getElementById('assets');
  const elCanvasDiv = document.createElement('div');
  elCanvasDiv.id = 'svgCanvasDiv';
  elCanvasDiv.style = 'width:100%;';
  elAssets.appendChild(elCanvasDiv);

  // pre-generate a load of canvases to represent all the different svg actors
  for (temp.i = 0; temp.i < 50; temp.i++) {
    // wrapper for temp.i
    temp.wrapperDiv = document.createElement("div");
    temp.wrapperDiv.id = `wrapper_${temp.i}`;
    temp.wrapperDiv.style = "display:inline-block;width:47%;" // so we can fit 2 cols on page

    // second canvas - rotate
    temp.keyA = `rotate_${temp.i}`;
    canvases[temp.keyA] = document.createElement("canvas");
    canvases[temp.keyA].id = temp.keyA;
    canvases[temp.keyA].style = 'width:15vw';
    contexts[temp.keyA] = canvases[temp.keyA].getContext('2d');
    canvases[temp.keyA].width = 142;
    canvases[temp.keyA].height = 142;
    temp.wrapperDiv.appendChild(canvases[temp.keyA]);

    // reference to this canvas
    canvasReferenceBank.push(temp.i);

    // append to parent canvasDiv
    if ($g.constants.DEBUG) {
      elCanvasDiv.prepend(temp.wrapperDiv);
    }
  }

  for (temp.i = 0; temp.i < elAssets.children.length; temp.i++) {
    const svgDOM = elAssets.children[temp.i];
    const svgId = svgDOM.id;
    // exit early if not svg
    if (svgDOM.tagName === 'svg') {
      svg[svgId] = {
        direction: -1, // using rotation to force redraws. Start at -1 to force first draw
        svg: svgDOM,
        html: svgDOM.outerHTML
      };

      svg[svgId].canvas = document.createElement("canvas");
      svg[svgId].canvas.id = `copyCanvas_${svgId}`;
      svg[svgId].canvas.style = 'width:15vw';
      svg[svgId].context = svg[svgId].canvas.getContext('2d');
      svg[svgId].canvas.width = 142;
      svg[svgId].canvas.height = 142;

      if ($g.constants.DEBUG) elCanvasDiv.prepend(svg[svgId].canvas);
      svgToCanvas(svgId);
    }
  }
}

function svgToCanvas(id) {
  // render to canvas using canvg
  canvg(svg[id].canvas, svg[id].html, {
    ignoreDimensions: true,
    scaleWidth: 100,
    scaleHeight: 100,
    // not sure why pixel ratio doesn't apply here
    offsetX: 21, // to draw 100x100 svg in middle of 142x142 canvas
    offsetY: 21, // to draw 100x100 svg in middle of 142x142 canvas
  });
  if ($g.constants.DEBUG) {
    // draw a 142 diameter circle representing the boundaries of rotating a 100x100 square
    svg[id].context.beginPath();
    svg[id].context.strokeStyle = 'rgb(255, 0, 0)';
    svg[id].context.lineWidth = 2 * $g.viewport.pixelRatio;
    svg[id].context.arc(svg[id].canvas.width / 2, svg[id].canvas.height / 2, svg[id].canvas.width / 2, 0, $g.constants.PI2);
    svg[id].context.stroke();
    // draw the 100x100 frame of original svg
    svg[id].context.beginPath();
    svg[id].context.strokeStyle = '#fff';
    svg[id].context.rect(21, 21, 100, 100);
    svg[id].context.stroke();
  }
}

function draw(targetContext, options = {
  // svg: // which svg?
  // id: // id of the actor being drawn, each actor can have different layers and rotation
  // d:, // direction, rotation
  // pixelLength: // also width, since all SVGs are square 100x100
  // x: coordinate of center svg
  // y: coordinate of center svg
}) {
  if (!(options.svg in svg)) return console.warn(`SVG ${options.svg} has not been loaded`);
  // only draws direction if orientation has updated
  // allocate a svg canvas spot
  temp.actor = (options.id === 0) ? $g.game.myShip : $g.game.actors[options.id];
  if (!temp.actor.svgCanvasRef) {
    temp.actor.svgCanvasRef = canvasReferenceBank.pop();
    if (temp.actor.svgCanvasRef === null) console.warn("time to implement deallocate for canvasSvg actors");
    // clear the settings for this canvas
    contexts[`rotate_${temp.actor.svgCanvasRef}`].direction = -1;
  }

  applyRotation(options.svg, temp.actor.svgCanvasRef, options.d);

  temp.imageRotateCanvasLength = options.pixelLength * $g.constants.SQRT2;

  // copy to target canvas
  targetContext.drawImage(
    canvases[`rotate_${temp.actor.svgCanvasRef}`],
    options.x - (temp.imageRotateCanvasLength * 0.5 /* offset so coordinate is center of image */), // top left X coordinate in targetContext where to paint
    options.y - (temp.imageRotateCanvasLength * 0.5 /* offset so coordinate is center of image */), // top left Y coordinate in targetContext where to paint
    /* keep in mind the canvas the canvas of rotated svg is 1.41 x wider to allow for full rotation */
    temp.imageRotateCanvasLength, // width of the eventual svg element
    temp.imageRotateCanvasLength, // height of the eventual
  );
}

function applyRotation(svgId, canvasRef, direction) {
  // round rotate to nearest integer
  const directionInt = Math.ceil(direction * 2) / 2; // rounds to nearest half (.5)

  if (contexts[`rotate_${canvasRef}`].direction === directionInt) return; // don't draw rotation if same angle
  contexts[`rotate_${canvasRef}`].direction = directionInt; // store for next compare
  // get the rotated context for drawing
  contexts[`rotate_${canvasRef}`].clearRect(0, 0, canvases[`rotate_${canvasRef}`].width, canvases[`rotate_${canvasRef}`].height);
  contexts[`rotate_${canvasRef}`].translate(canvases[`rotate_${canvasRef}`].width/2, canvases[`rotate_${canvasRef}`].height/2);
  contexts[`rotate_${canvasRef}`].rotate(directionInt * $g.constants.RADIAN);
  contexts[`rotate_${canvasRef}`].drawImage(
    svg[svgId].canvas, // from copyCanvas
    -canvases[`rotate_${canvasRef}`].width/2,
     -canvases[`rotate_${canvasRef}`].width/2
   );
  // restore context back to normal
  contexts[`rotate_${canvasRef}`].setTransform(1, 0, 0, 1, 0, 0);
}

export default { init, draw };
