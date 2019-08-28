import decorate from '../decorator/decorate.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Ship {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Ship.constructor');
    const decoratorList = ['entity', 'drawable', 'settersAndHooks', 'updatable', 'physics', 'collidable', 'shipThrust', 'shipWeapons'];
    decorate.add(this, initialObj, decoratorList);

    this.applyType();

    this.addDraw('drawMe');
    this.addDraw('drawCollisionPoints', 100);

    perf.stop('Ship.constructor');
  }

  // add a fn to the draws queue
  drawMe(context) { perf.start('Ship.drawMe');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Ship.drawMe');

    canvasSvg.draw(context, {
      svg: 'MyShipSVG',
      id: this.id,
      d: this.d - $g.game.myShip.d,
      pixelLength: this.length * $g.viewport.pixelsPerMeter,
      x: temp.viewportPixel.x,
      y: temp.viewportPixel.y
    });

     perf.stop('Ship.drawMe');
  };

  onCollide() { perf.start('Ship.onCollide');
    console.log('ship collide!');
    return perf.stop('Ship.onCollide');;
  }

  applyType() { perf.start('Ship.applyType');
    Object.assign(this, shipTypes[this.type]);
    perf.stop('Ship.applyType');
  }
}

const shipTypes = {
  0: { // 0
    sMaxShip: 50, // this is the ship max speed value and fixed. sMax will vary depending on thrust
    sMax: 40,
    aSMax: 1,
    length: 20,
    mass: 80000, // kg
    polygon: [ // 100 x 100, but with middle at 0, so -50 -> 50 bounds
      { x: -4, y: 48, },
      { x: -29, y: -30 },
      { x: -18, y: -45 },
      // other side
      { x: 18, y: -45 },
      { x: 29, y: -30 },
      { x: 4, y: 48 }
    ],
  }
};
