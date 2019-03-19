import $g from '../utils/globals.js';
let elShipView = null;
const dictionary = {
  A:0, B:1, C:2, D:3, E:4,
  F:5, G:6, H:7, I:8, J:9,
  K:10, L:11, M:12, N:13, O:14,
  P:15, Q:16, R:17, S:18, T:19,
  U:20, V:21, W:22, X:23, Y:24, Z:25,
  '-':26, '.':27, ',':28, '(':29, ')':30,
  a:31, b:32, c:33, d:34, e:35,
  f:36, g:37, h:38, i:39, j:40,
  k:41, l:42, m:43, n:44, o:45,
  p:46, q:47, r:48, s:49, t:50,
  u:51, v:52, w:53, x:54, y:55, z:56,
};

let textCanvas = null;
let textContext = null;
let letterWidth = 0;
let letterHeight = 0;
let letterSpacing = 0;
let initted = false;

function init() {
  if (initted) return;
  initted = true;
  // load all assets and sort them into respective canvases
  textCanvas = document.createElement("canvas");
  textContext = textCanvas.getContext('2d');
  textCanvas.id = 'textCanvas';
  textCanvas.height = $g.viewport.pixelWidth; // minus 3 to force a bit of alpha blend
  textCanvas.width = $g.viewport.pixelWidth; // minus 3 to force a bit of alpha blend
  // set the font
  textContext.font = `${15*$g.viewport.pixelRatio}px 'Share Tech Mono'`;

  // solve for letter dimensions
  letterWidth = textContext.measureText('M').width;
  letterHeight = letterWidth * (1.5);
  letterSpacing = letterWidth - (2 * $g.viewport.pixelRatio);

  if ($g.constants.DEBUG) {
    elShipView = document.getElementById('shipView');
    elShipView.prepend(textCanvas);
    textCanvas.style = "top:15%; left:0; border: 2px solid rgb(40, 0, 0);width: 100%;position:absolute;"
  }

  // white
  textContext.fillStyle = '#FFFFFF';
  textContext.fillText('0123456789', 0, letterHeight * 3);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 4);
  // red
  textContext.fillStyle = '#FF0000';
  textContext.fillText('0123456789', 0, letterHeight);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 2);
  // grey
  textContext.fillStyle = 'rgba(255, 255, 255, .3)';
  textContext.fillText('0123456789', 0, letterHeight * 5);
  textContext.fillText(Object.keys(dictionary).join(''), 0, letterHeight * 6);
}

// origin of draw will be upper left pixel
let i = 0;
let sourceX = 0, sourceY = 0, destX = 0, destY = 0, sourceYMod = 0;
function draw(targetContext, text, x, y, type = 0 /* 0: white, 1: grey, 2: red */) {
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
}

export default { init, draw, height: letterHeight };
