import physics from './_physics.js';
import drawable from './_drawable.js';
import mappable from './_mappable.js';
import svg from './svg.js';

export default class Ship {
  constructor(initialObj = {}) { // e.g. { x,y,w,h,d,s }
    drawable.add(this);
    physics.add(this);
    mappable.add(this);

    // add a fn to the draws queue
    this.drawMyShip = function(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      svg.draw(context, 'MyShipSVG', { direction: 0, x: context.canvas.width / 2, y: context.canvas.height / 2 });
    };
    this.draws.push('drawMyShip');
  }
}
