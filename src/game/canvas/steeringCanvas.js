import $g from '../../utils/globals.js';
import canvasText from '../../utils/canvasText.js';
import maths from '../../utils/maths.js';

let canvas = null;
let context = null;
let elDragger = null;
let elSteering = null;
let elSteeringBounds = null;
let elSteeringCenterX = null;
let elSteeringCenterY = null;
let lineWidth = null;

function init(width, height) {
  // solve for center of #steering
  elSteering = document.getElementById('steering');
  elDragger = document.getElementById('dragger');
  elSteeringBounds = elSteering.getBoundingClientRect();
  elSteeringCenterX = (elSteeringBounds.x + (elSteeringBounds.width / 2)) * $g.viewport.pixelRatio;
  elSteeringCenterY = (elSteeringBounds.y + (elSteeringBounds.height / 2)) * $g.viewport.pixelRatio;

  canvas = document.getElementById('canvas_steering');
  context = canvas.getContext('2d');

  // set canvas resolution
  canvas.width = elSteeringBounds.width * $g.viewport.pixelRatio;
  canvas.height = elSteeringBounds.height * $g.viewport.pixelRatio;

  // solve for thickness of arc
  lineWidth = elDragger.getBoundingClientRect().height * $g.viewport.pixelRatio * 2;
  context.lineWidth = lineWidth;
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(0, 255, 0, .1)';
  context.beginPath();
  context.arc(
    canvas.width / 2, canvas.height / 2,
    canvas.width / 2,
    1.5 * Math.PI,
    maths.degreeToRadian(45),
    true
  );
  context.stroke();


}

export default { init, draw };
