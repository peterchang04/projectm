import decorate from '../decorator/decorate.js';
import perf from '../../utils/perf.js';
import maths from '../../utils/maths.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Projectile {
  constructor(initialObj = { d: 0, sMax: 80, type: 0 }) { /* e.g. { x,y,w,h,d,s } */ perf.start('Projectile.constructor');
    decorate.add(this, initialObj, ['entity', 'drawable', 'updatable', 'physics', 'collidable']);

    this.addUpdate('removeByDistance', 100, 10);

    this.inits.push('factoryInit');

    // get rid of unneeded functions
    this.removeUpdate('updateDirection');
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('updateSpeedByForce');

    // add to draw queue
    this.addDraw('drawMe');
    this.addDraw('drawCollisionPoints', 100, 'canvas_projectiles');
    perf.stop('Projectile.constructor');
  }

  onCollide(collidee) { perf.start('Projectile.onCollide');
    console.log(this.id, 'collided with', collidee.id, this.exemptColliders);
    this.remove();
    perf.stop('Projectile.onCollide');
  }

  // add a fn to the draws queue
  drawMe(context) { perf.start('Projectile.drawMe');
    // solve for distance from myShip by coordinate
    this.temp.pixelDistX = (this.mX * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mX * $g.viewport.pixelsPerMeter);
    this.temp.pixelDistY = (this.mY * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mY * $g.viewport.pixelsPerMeter);

    // translate this point by myShip rotation (https://academo.org/demos/rotation-about-point/)
    this.temp.pixelDistXPrime = (this.temp.pixelDistX * $g.game.myShip.dY) - (this.temp.pixelDistY * $g.game.myShip.dX);
    this.temp.pixelDistYPrime = (this.temp.pixelDistY * $g.game.myShip.dY) + (this.temp.pixelDistX * $g.game.myShip.dX);

    // see if it's off screen
    if (Math.abs(this.temp.pixelDistXPrime) > $g.viewport.pixelWidth || Math.abs(this.temp.pixelDistYPrime) > $g.viewport.pixelHeight) {
      perf.stop('Projectile.drawMe');
      return;
    }

    // reset context
    context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate
    // rotation center set on projectile center
    context.translate($g.viewport.shipPixelX + this.temp.pixelDistXPrime, $g.viewport.shipPixelY - this.temp.pixelDistYPrime);
    context.rotate((this.d - $g.game.myShip.d) * $g.constants.RADIAN);

    context.fillStyle = this.projectileColor;
    context.fillRect(
      0 + this.widthOffsetX,
      0, // y coordinates on canvas increase down on screen
      this.projectileWidth,
      this.projectileHeight
    );
    perf.stop('Projectile.drawMe');
  };

  removeByDistance(elapsed) { perf.start('Projectile.removeByDistance');
    if (maths.getDistance(this.mXStart, this.mYStart, this.mX, this.mY) > this.maxDistance) {
      this.remove();
    }
    perf.stop('Projectile.removeByDistance');
  }

  factoryInit() {
    // set speed to sMax
    this.updateTrig();

    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;
  }

  applyType() { perf.start('Projectile.applyType');
    Object.assign(this, types[this.type]);
    // solve for widthOffsetX based on projectileWidth
    this.widthOffsetX = -0.5 * types[this.type].projectileWidth;

    // record beginning mX mY
    this.mXStart = this.mX;
    this.mYStart = this.mY;

    perf.stop('Projectile.applyType');
  }
}

const types = {
  0: { // standard
    sMax: 150,
    length: 0.5,
    mass: 0.5, // kg
    projectileColor: "#bbb",
    projectileWidth: 3,
    projectileHeight: 8,
    maxDistance: 250,
    polygon: [
      { x:0, y:50 },
      { x:0, y:0 },
    ]
  },
  1: { // lasery thing
    sMax: 800,
    length: 0.5,
    mass: 0.5, // kg
    projectileColor: "#FF0000",
    projectileWidth: 1,
    projectileHeight: 50,
    maxDistance: 200,
    polygon: [
      { x:0, y:50 },
      { x:0, y:0 },
    ]
  },
};
