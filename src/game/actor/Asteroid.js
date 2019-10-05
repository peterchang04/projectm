import canvasSvg from '../../utils/canvasSvg.js';
import compositeSvg from '../../utils/compositeSvg';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import decorate from '../decorator/decorate.js';

const temp = {};

export default class Asteroid {
  constructor() { /* e.g. { x,y,w,h,d,s } */ perf.start('Asteroid.constructor');
    decorate.add(this, {}, ['entity', 'drawable', 'updatable', 'physics', 'collidable']);
    this.name = `A-${this.id}`;
    
    // get rid of unneeded functions
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('updateSpeedByForce');

    // setup composite drawing queue
    this.svgComposites = ['rotate', 'target'];

    this.addDraw('drawMe', 1, 'canvas_actors');
    this.addDraw('drawCollisionPoints', 100, 'canvas_actors');
    perf.stop('Asteroid.constructor');
  }

  onCollide(collidee) { perf.start('Asteroid.onCollide');
    // console.log(collidee.id, this.id);
    // console.log('asteroid collide!');
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
    if (!temp.viewportPixel.isVisible && $g.game.myShip.targets.indexOf(this.id) === -1) return perf.stop('Asteroid.drawMe');

    compositeSvg.draw(context, this, temp.viewportPixel.x, temp.viewportPixel.y);

    perf.stop('Asteroid.drawMe');
  };
}

const types = {
  0: { // 0
    // sMax: 40,
    // aSMax: 1,
    // length: 20,
    mass: 80000, // kg
    svg: 'AsteroidSVG',
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