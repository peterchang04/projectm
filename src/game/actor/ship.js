import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import mappable from '../decorator/_mappable.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';

export default class Ship {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ let p = perf.start('Ship.constructor');
    Object.assign(this, initialObj);

    drawable.add(this);
    physics.add(this);
    mappable.add(this);

    applyType(this);

    // add a fn to the draws queue
    this.drawMyShip = function(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      canvasSvg.draw(context, 'MyShipSVG', { direction: 0, x: context.canvas.width / 2, y: context.canvas.height / 2 });
    };
    this.draws.push('drawMyShip');
    perf.stop('Ship.constructor', p);
  }
}

function applyType(ship, type = 0) { let p = perf.start('Ship.applyType');
  Object.assign(ship, shipTypes[type]);
  perf.stop('Ship.applyType', p);
}

const shipTypes = {
  0: { // 0
    sMax: 30,
    aSMax: 1,
    length: 20,
    mass: 80000, // kg
  }
};
