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
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Projectile.drawMe');

    // reset context
    context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate
    // rotation center set on projectile center
    context.translate(temp.viewportPixel.x, temp.viewportPixel.y);
    context.rotate((this.d - $g.game.myShip.d) * $g.constants.RADIAN);

    context.fillStyle = this.projectileColor;
    context.fillRect(
      0 + this.widthOffsetX,
      0, // y coordinates on canvas increase down on screen
      this.projectileWidth * $g.viewport.pixelsPerMeter,
      -this.length * $g.viewport.pixelsPerMeter,
    );
    perf.stop('Projectile.drawMe');
  };

  removeByDistance(elapsed) { perf.start('Projectile.removeByDistance');
    if (maths.getDistance(this.mXStart, this.mYStart, this.mX, this.mY) > this.maxDistance) {
      this.remove();
    }
    perf.stop('Projectile.removeByDistance');
  }

  factoryInit() { perf.start('Projectile.factoryInit');
    // set speed to sMax
    this.updateTrig();

    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;
    perf.stop('Projectile.factoryInit');
  }

  applyType() { perf.start('Projectile.applyType');
    Object.assign(this, types[this.type]);
    // solve for widthOffsetX based on projectileWidth
    this.widthOffsetX = -0.5 * (types[this.type].projectileWidth * $g.viewport.pixelsPerMeter);

    // record beginning mX mY
    this.mXStart = this.mX;
    this.mYStart = this.mY;

    perf.stop('Projectile.applyType');
  }
}

const types = {
  0: { // standard
    sMax: 150,
    length: 2,
    mass: 0.5, // kg
    projectileColor: "#fff",
    projectileWidth: 1, // in meters
    maxDistance: 500,
    polygon: [
      { x:0, y:50 },
      { x:0, y:-50 },
    ]
  },
  1: { // lasery thing
    sMax: 800,
    length: 20,
    mass: 0.5, // kg
    projectileColor: "#FF0000",
    projectileWidth: .5,
    maxDistance: 200,
    polygon: [
      { x:0, y: 125 }, // exaggerate forward detect due to laser speed
      { x:0, y: -75 },
    ]
  },
};
