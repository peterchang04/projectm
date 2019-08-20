import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import shipThrust from '../decorator/_shipThrust.js';
import shipWeapons from '../decorator/_shipWeapons.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';

export default class Ship {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Ship.constructor');
    Object.assign(this, initialObj);

    drawable.add(this);
    physics.add(this);
    shipThrust.add(this);
    shipWeapons.add(this);

    applyType(this);

    // add a fn to the draws queue
    this.drawMyShip = function(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      canvasSvg.draw(context, 'MyShipSVG', { direction: 0, x: context.canvas.width / 2, y: context.canvas.height / 2 });
    };
    this.draws.push('drawMyShip');
    perf.stop('Ship.constructor');
  }
}

function applyType(ship, type = 0) { perf.start('Ship.applyType');
  Object.assign(ship, shipTypes[type]);
  perf.stop('Ship.applyType');
}

const shipTypes = {
  0: { // 0
    sMaxShip: 50, // this is the ship max speed value and fixed. sMax will vary depending on thrust
    sMax: 40,
    aSMax: 1,
    length: 20,
    mass: 80000, // kg
  }
};
