import canvg from 'canvg';
import $g from '../utils/globals.js';
import perf from '../utils/perf.js';

const temp = {};
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

function init() { perf.start('canvasSvg.init');
  // load all assets and sort them into respective canvases
  const elAssets = document.getElementById('assets');
  const elCanvasDiv = document.createElement('div');
  elCanvasDiv.id = 'svgCanvasDiv';
  elCanvasDiv.style = 'width:100%;';
  elAssets.appendChild(elCanvasDiv);

  // copy all svgs to canvases
  for (temp.i = 0; temp.i < elAssets.children.length; temp.i++) {
    const svgDOM = elAssets.children[temp.i];
    const svgId = svgDOM.id;
    // exit early if not svg
    if (svgDOM.tagName === 'svg') {
      $g.svg[svgId] = {
        html: svgDOM.outerHTML
      };

      $g.svg[svgId].canvas = document.createElement("canvas");
      $g.svg[svgId].canvas.id = svgId;
      $g.svg[svgId].canvas.style = 'width:15vw';
      $g.svg[svgId].context = $g.svg[svgId].canvas.getContext('2d');
      $g.svg[svgId].canvas.width = 142;
      $g.svg[svgId].canvas.height = 142;

      if ($g.constants.DEBUG) elCanvasDiv.prepend($g.svg[svgId].canvas);
      svgToCanvas(svgId);
    }
  }
  perf.stop('canvasSvg.init');
}

function svgToCanvas(id) { perf.start('canvasSvg.svgToCanvas');
  // render to canvas using canvg
  canvg($g.svg[id].canvas, $g.svg[id].html, {
    ignoreDimensions: true,
    scaleWidth: 100,
    scaleHeight: 100,
    // not sure why pixel ratio doesn't apply here
    offsetX: 21, // to draw 100x100 svg in middle of 142x142 canvas
    offsetY: 21, // to draw 100x100 svg in middle of 142x142 canvas
  });
  if ($g.constants.DEBUG) {
    // draw a 142 diameter circle representing the boundaries of rotating a 100x100 square
    $g.svg[id].context.beginPath();
    $g.svg[id].context.strokeStyle = 'rgb(255, 0, 0)';
    $g.svg[id].context.lineWidth = 2 * $g.viewport.pixelRatio;
    $g.svg[id].context.arc($g.svg[id].canvas.width / 2, $g.svg[id].canvas.height / 2, $g.svg[id].canvas.width / 2, 0, $g.constants.PI2);
    $g.svg[id].context.stroke();
    // draw the 100x100 frame of original svg
    $g.svg[id].context.beginPath();
    $g.svg[id].context.strokeStyle = '#fff';
    $g.svg[id].context.rect(21, 21, 100, 100);
    $g.svg[id].context.stroke();
  }
  perf.stop('canvasSvg.svgToCanvas');
}

export default { init };
