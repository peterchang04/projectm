import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import collidable from '../decorator/_collidable.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Asteroid {
  constructor(initialObj = { type: 0 }) { /* e.g. { x,y,w,h,d,s } */ perf.start('Asteroid.constructor');
    this.class = 'Asteroid';
    this.isCollidable = true;
    Object.assign(this, initialObj);

    drawable.add(this);
    physics.add(this);
    this.applyType();
    collidable.add(this);
    this.setupPolygon();
    if (this.id === 201) console.log(this);
    // get rid of unneeded functions
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('updateSpeedByForce');

    this.addDraw('drawMe');
    this.addDraw('drawCollisionPoints', 100, 'canvas_actors');
    perf.stop('Asteroid.constructor');
  }

  onCollide() {
    return;
  }

  applyType() { perf.start('Asteroid.applyType');
    Object.assign(this, types[this.type]);
    // solve for widthOffsetX based on projectileWidth
    // set speed to sMax
    this.updateTrig();

    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;

    perf.stop('Asteroid.applyType');
  };

  // add a fn to the draws queue
  drawMe(context) {
    // solve for distance from myShip by coordinate
    this.temp.pixelDistX = (this.mX * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mX * $g.viewport.pixelsPerMeter);
    this.temp.pixelDistY = (this.mY * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mY * $g.viewport.pixelsPerMeter);

    // translate this point by myShip rotation (https://academo.org/demos/rotation-about-point/)
    this.temp.pixelDistXPrime = (this.temp.pixelDistX * $g.game.myShip.dY) - (this.temp.pixelDistY * $g.game.myShip.dX);
    this.temp.pixelDistYPrime = (this.temp.pixelDistY * $g.game.myShip.dY) + (this.temp.pixelDistX * $g.game.myShip.dX);

    canvasSvg.draw(context, {
      svg: 'AsteroidSVG',
      id: this.id,
      d: this.d,
      pixelLength: this.length * $g.viewport.pixelsPerMeter,
      x: $g.viewport.shipPixelX + this.temp.pixelDistXPrime,
      y: $g.viewport.shipPixelY - this.temp.pixelDistYPrime
    });
  };
}

const types = {
  0: { // 0
    // sMax: 40,
    // aSMax: 1,
    // length: 20,
    // mass: 80000, // kg
    polygon: [
      { x: -23, y: 46, },
      { x: -50, y: 0 },
      { x: -45, y: -45 },

      // other side
      { x: 50, y: -45, },
      { x: 50, y: 0 },
      { x: 25, y: 50 },
    ],
  }
};
