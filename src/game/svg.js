import canvg from 'canvg';
import globals from '../utils/globals.js';
const svg = {};
const elAssets = null;
/*
  Given an svg id
  1. <svg> is converted into text string and stored in js memory
  2. svg is translated to an canvas using canvg, stored on svg[id].canvas
    any compositing (lighting, damage textures) will be done here
    This is only redrawn when necessary
  3. for rotations, svg[id].canvas is drawn to svg[id].canvas_rotate.
    this is faster than copying from canvg every time
    This is only redrawn when svg[id].canvas changes or rotation updates
  4. draw to game canvas from canvas_rotate
*/

function init() {
  // load all assets and sort them into respective canvases
  const elAssets = document.getElementById('assets');

  for (let i = 0; i < elAssets.children.length; i++) {
    const svgDOM = elAssets.children[i];
    const id = svgDOM.id;
    if (svgDOM.tagName !== 'svg') return;
    svg[id] = {
      direction: -1, // using rotation to force redraws. Start at -1 to force first draw
      svg: svgDOM,
      html: svgDOM.outerHTML
    };
    // wrap the svg in a id based container
    svg[id].wrapper = document.createElement('div');
    svg[id].wrapper.style = `display:inline-block; background-color: rgb(15, 0, 0); border: 2px solid #444;`;
    svg[id].wrapper.id = `${id}_wrapper`;
    svgDOM.parentNode.insertBefore(svg[id].wrapper, svgDOM);
    svg[id].wrapper.appendChild(svgDOM);
    // create a copy canvas for this svg
    svg[id].canvas = document.createElement("canvas");
    svg[id].canvas.id = `${id}_canvas`;
    svg[id].context = svg[id].canvas.getContext('2d');
    /* all svgs should be natively 100x100. 142 is the hypotenuse, so as we rotate, no edges will be lost */
    svg[id].canvas.width = 142 * globals.viewport.pixelRatio;
    svg[id].canvas.height = 142 * globals.viewport.pixelRatio;
    // create rotation canvas
    svg[id].canvas_rotate = document.createElement("canvas");
    svg[id].canvas_rotate.id = `${id}_canvas_rotate`;
    svg[id].context_rotate = svg[id].canvas_rotate.getContext('2d');
    svg[id].canvas_rotate.width = svg[id].canvas.width;
    svg[id].canvas_rotate.height = svg[id].canvas.height;

    // copy the svg to copy canvas
    svgToCanvas(id);

    // for debugging, otherwise these should be undrawn canvases
    if (globals.constants.DEBUG) {
      applyRotation(id, 0);
      svg[id].wrapper.appendChild(svg[id].canvas);
      svg[id].wrapper.appendChild(svg[id].canvas_rotate);
      svg[id].canvas.style = `height:50px; width:50px;border-left:1px solid #222;`;
      svg[id].canvas_rotate.style = `height:50px; width:50px;border-left:1px solid #222;`;
    }
  } // end for
}

function svgToCanvas(id) {
  // render to canvas using canvg
  canvg(svg[id].canvas, svg[id].html, {
    ignoreDimensions: true,
    scaleWidth: 100 * globals.viewport.pixelRatio,
    scaleHeight: 100 * globals.viewport.pixelRatio,
    // not sure why pixel ratio doesn't apply here
    offsetX: 21, // to draw 100x100 svg in middle of 142x142 canvas
    offsetY: 21, // to draw 100x100 svg in middle of 142x142 canvas
  });
  if (globals.constants.DEBUG) {
    // draw a 142 diameter circle representing the boundaries of rotating a 100x100 square
    svg[id].context.beginPath();
    svg[id].context.strokeStyle = 'rgb(255, 0, 0)';
    svg[id].context.lineWidth = 2 * globals.viewport.pixelRatio;
    svg[id].context.arc(svg[id].canvas.width / 2, svg[id].canvas.height / 2, svg[id].canvas.width / 2, 0, globals.constants.PI2);
    svg[id].context.stroke();
    // draw the 100x100 frame of original svg
    svg[id].context.rect(21 * globals.viewport.pixelRatio, 21 * globals.viewport.pixelRatio, 100 * globals.viewport.pixelRatio, 100 * globals.viewport.pixelRatio);
    svg[id].context.strokeStyle = '#fff';
    svg[id].context.stroke();
  }
}

function draw(targetContext, id, options = {
  // direction:,
  // widthPercent,
  // x,y (centerpoint)
}) {
  if (!(id in svg)) return console.warn(`${id} has not been loaded`);

  // only draws direction if orientation has updated
  applyRotation(id, options.direction);

  // copy to target canvas
  targetContext.drawImage(svg[id].canvas_rotate, 0, 0, targetContext.canvas.width, targetContext.canvas.width);
}

function applyRotation(id, direction) {
  // round rotate to nearest integer
  const directionInt = Math.ceil(direction * 2) / 2; // rounds to nearest half (.5)

  if (svg[id].direction === directionInt) return; // don't draw rotation if same angle
  // get the rotated context for drawing
  svg[id].context_rotate.clearRect(0, 0, svg[id].canvas_rotate.width, svg[id].canvas_rotate.height);
  svg[id].context_rotate.translate(svg[id].canvas_rotate.width/2, svg[id].canvas_rotate.height/2);
  svg[id].context_rotate.rotate(directionInt * globals.constants.RADIAN);
  svg[id].context_rotate.drawImage(svg[id].canvas, -svg[id].canvas_rotate.width/2, -svg[id].canvas_rotate.width/2);
  // restore context back to normal
  svg[id].context_rotate.setTransform(1, 0, 0, 1, 0, 0);

  // save the updated rotation
  svg[id].direction = directionInt;
}

export default { init, draw };
