// Copies images of prerendered text from one canvas to another. More performant than actually trying to render text on the fly
import $g from '../utils/globals.js';
import perf from '../utils/perf.js';

let elShipView = null;
const dictionary = {
  A:0, B:1, C:2, D:3, E:4,
  F:5, G:6, H:7, I:8, J:9,
  K:10, L:11, M:12, N:13, O:14,
  P:15, Q:16, R:17, S:18, T:19,
  U:20, V:21, W:22, X:23, Y:24, Z:25,
  a:26, b:27, c:28, d:29, e:30,
  f:31, g:32, h:33, i:34, j:35,
  k:36, l:37, m:38, n:39, o:40,
  p:41, q:42, r:43, s:44, t:45,
  u:46, v:47, w:48, x:49, y:50, z:51,
  '-':52, '.':53, ',':54, '(':55, ')':56, '/':57, '°':58
};

let textCanvas = null;
let textContext = null;
let letterWidth = 0;
let letterHeight = 0;
let letterSpacing = 0;
let initted = false;

function reset() {
  init();
}

function init() { perf.start('canvasText.init'); // init called by index.html font resource onload
  initted = true;
  window.addEventListener('reloadCanvasText', () => {
    reset(); // if the font loads after init is called, reload all text elements
  });
  // load all assets and sort them into respective canvases
  textCanvas = document.createElement("canvas");
  textContext = textCanvas.getContext('2d');
  textCanvas.id = 'textCanvas';
  textCanvas.height = $g.viewport.pixelGameWidth * 1.5; // 1.5 to help all the letters fit
  textCanvas.width = $g.viewport.pixelGameWidth * 1.5; // 1.5 to help all the letters fit
  // set the font
  textContext.font = `${15*$g.viewport.pixelRatio}px 'Share Tech Mono', 'Courier New'`;

  // solve for letter dimensions
  letterWidth = textContext.measureText('M').width;
  letterHeight = letterWidth * (1.5);
  letterSpacing = letterWidth - (2 * $g.viewport.pixelRatio);

  if ($g.constants.DEBUG) {
    elShipView = document.getElementById('gameView');
    elShipView.prepend(textCanvas);
    textCanvas.style = "top:15%; left:0; border: 2px solid rgb(40, 0, 0);width: 100%;position:absolute;"
  }

  // white
  textContext.fillStyle = '#FFFFFF';
  textContext.fillText('0123456789', 0, letterHeight * 1);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 2);
  // red
  textContext.fillStyle = '#FF0000';
  textContext.fillText('0123456789', 0, letterHeight * 3);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 4);
  // grey
  textContext.fillStyle = 'rgba(255, 255, 255, .3)';
  textContext.fillText('0123456789', 0, letterHeight * 5);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 6);

  global.initCanvasText = init;
  perf.stop('canvasText.init');
}

// origin of draw will be upper left pixel
let i = 0;
let sourceX = 0, sourceY = 0, destX = 0, destY = 0, sourceYMod = 0;
function draw(targetContext, text, x, y, type = 0 /* 0: white, 1: grey, 2: red */) { perf.start('canvasText.draw');
  if (!initted) return perf.stop('canvasText.draw');;
  sourceY = type * letterHeight * 2; // for color
  destX = x;
  destY = y;

  for(i = 0; i < text.length; i++) {
    if (text[i] === ' ') {
      destX += (letterSpacing / 2); // smaller width for space than letter, looks better
      continue;
    }
    if (isNaN(text[i])) { // letters
      sourceYMod = letterHeight;
      sourceX = dictionary[text[i]] * letterWidth;
    } else {
      sourceYMod = 0;
      sourceX = +text[i] * letterWidth;
    }

    targetContext.drawImage(
      textCanvas,
      sourceX, sourceY + sourceYMod + $g.viewport.pixelRatio, // adding pixel ratio as crude fix
      letterWidth, letterHeight,
      destX, destY,
      letterWidth,
      letterHeight
    );

    destX += letterSpacing; // increment letter
  }
  perf.stop('canvasText.draw');
}

function getLetterHeight() {
  return letterHeight;
}

export default { init, draw, getLetterHeight };
