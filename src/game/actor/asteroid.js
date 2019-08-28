import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import decorate from '../decorator/decorate.js';

const temp = {};

export default class Asteroid {
  constructor() { /* e.g. { x,y,w,h,d,s } */ perf.start('Asteroid.constructor');
    decorate.add(this, {}, ['entity', 'drawable', 'updatable', 'physics', 'collidable']);
    // get rid of unneeded functions
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('updateSpeedByForce');

    this.addDraw('drawMe');
    this.addDraw('drawCollisionPoints', 100);
    perf.stop('Asteroid.constructor');
  }

  onCollide(collidee) { perf.start('Asteroid.onCollide');
    console.log(collidee.id, this.id);
    console.log('asteroid collide!');
    return perf.stop('Asteroid.onCollide');;
  }

  applyType() { perf.start('Asteroid.applyType');
    Object.assign(this, types[this.type]);
    // solve for widthOffsetX based on projectileWidth
    // set speed to sMax
    this.updateTrig(); // rerun this to allow sX, sY to be solved

    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;

    perf.stop('Asteroid.applyType');
  };

  // add a fn to the draws queue
  drawMe(context) { perf.start('Asteroid.drawMe');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Asteroid.drawMe');

    canvasSvg.draw(context, {
      svg: 'AsteroidSVG',
      id: this.id,
      d: this.d - $g.game.myShip.d,
      pixelLength: this.length * $g.viewport.pixelsPerMeter,
      x: temp.viewportPixel.x,
      y: temp.viewportPixel.y
    });

     perf.stop('Asteroid.drawMe');
  };
}

const types = {
  0: { // 0
    // sMax: 40,
    // aSMax: 1,
    // length: 20,
    mass: 80000, // kg
    polygon: [
      { x: -30, y: 41, },
      { x: -48, y: 9 },
      { x: -31, y: -49 },
      { x: 3, y: -49, },

      // other side
      { x: 49, y: -23},

      { x: 49, y: 16 },
      { x: 16, y: 48 },
    ],
  }
};
