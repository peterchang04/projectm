import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import shipThrust from '../decorator/_shipThrust.js';
import perf from '../../utils/perf.js';
import maths from '../../utils/maths.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Projectile {
  constructor(initialObj = { d: 0, sMax: 80, type: 0 }) { /* e.g. { x,y,w,h,d,s } */ perf.start('Projectile.constructor');
    Object.assign(this, initialObj);
    drawable.add(this);
    physics.add(this);

    this.applyType = () => { perf.start('Projectile.applyType');
      Object.assign(this, projectileTypes[this.type]);
      // solve for widthOffsetX based on projectileWidth
      this.widthOffsetX = -0.5 * projectileTypes[this.type].projectileWidth;
      // set speed to sMax
      this.updateTrig();

      this.sX = this.dX * this.sMax;
      this.sY = this.dY * this.sMax;

      // remove itself from $g.game.actors after durationMS
      setTimeout(() => {
        this.remove();
      }, this.durationMS);
      perf.stop('Projectile.applyType');
    };

    // add a fn to the draws queue
    this.drawMe = function(context) { perf.start('Projectile.drawMe');
      // solve for distance from myShip by coordinate
      temp.pixelDistX = (this.mX * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mX * $g.viewport.pixelsPerMeter);
      temp.pixelDistY = (this.mY * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mY * $g.viewport.pixelsPerMeter);

      // translate this point by myShip rotation (https://academo.org/demos/rotation-about-point/)
      temp.pixelDistXPrime = (temp.pixelDistX * $g.game.myShip.dY) - (temp.pixelDistY * $g.game.myShip.dX);
      temp.pixelDistYPrime = (temp.pixelDistY * $g.game.myShip.dY) + (temp.pixelDistX * $g.game.myShip.dX);

      // see if it's off screen
      if (Math.abs(temp.pixelDistXPrime) > $g.viewport.pixelWidth || Math.abs(temp.pixelDistYPrime) > $g.viewport.pixelHeight) {
        perf.stop('Projectile.drawMe');
        return;
      }

      // reset context
      context.setTransform(1, 0, 0, 1, 0, 0); // restore context rotate / translate
      // rotation center set on projectile center
      context.translate($g.viewport.shipPixelX + temp.pixelDistXPrime, $g.viewport.shipPixelY - temp.pixelDistYPrime);
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

    // add to draw queue
    this.draws.push('drawMe');
    perf.stop('Projectile.constructor');
  }
}

const projectileTypes = {
  0: { // standard
    sMax: 150,
    length: 0.5,
    mass: 0.5, // kg
    projectileColor: "#bbb",
    projectileWidth: 3,
    projectileHeight: 8,
    durationMS: 8000, // how long it should last before removing
  },
  1: { // lasery thing
    sMax: 800,
    length: 0.5,
    mass: 0.5, // kg
    projectileColor: "#FF0000",
    projectileWidth: 1,
    projectileHeight: 50,
    durationMS: 3000, // how long it should last before removing
  },
};

global.projectile = Projectile;
