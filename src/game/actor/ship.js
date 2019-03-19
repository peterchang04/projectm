import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import mappable from '../decorator/_mappable.js';
import canvasSvg from '../../utils/canvasSvg.js';

export default class Ship {
  constructor(initialObj = {}) { // e.g. { x,y,w,h,d,s }
    drawable.add(this);
    physics.add(this);
    mappable.add(this);

    this.length = initialObj.length || 20;

    // add a fn to the draws queue
    this.drawMyShip = function(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      canvasSvg.draw(context, 'MyShipSVG', { direction: 0, x: context.canvas.width / 2, y: context.canvas.height / 2 });
    };
    this.draws.push('drawMyShip');
  }
}
