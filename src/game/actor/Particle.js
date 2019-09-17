import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';
import color from '../../utils/color.js';
import decorate from '../decorator/decorate.js';
import { cloneDeep } from 'lodash';

const temp = {};

export default class Particle {
  constructor(initialObj = { c: '#ffffff', opacity: 1 }) { /* e.g. { x,y,w,h,d,s } */ perf.start('Particle.constructor');
    decorate.add(this, initialObj, ['entity', 'drawable', 'updatable', 'physics']);

    // get rid of unneeded functions
    this.removeUpdate('updateDirection');
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('updateSpeedByForce');

    this.addDraw('drawMe');
    this.addUpdate('runAnimate', 100, 1);
    this.inits.push('factoryInit');
    perf.stop('Particle.constructor');
  }

  drawMe(context) { perf.start('Particle.drawMe');
    this[this.drawFunc](context);
    perf.stop('Particle.drawMe');
  }

  _blur(context) { perf.start('Particle._blur');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Particle._blur');
    temp.widthPixels = this.length * $g.viewport.pixelsPerMeter;
    temp.widthOffsetPixels = temp.widthPixels / 2;

    // create the gradient
    temp.radialGradient = context.createRadialGradient(temp.viewportPixel.x, temp.viewportPixel.y, 0, temp.viewportPixel.x, temp.viewportPixel.y, temp.widthOffsetPixels);
    temp.opacityColor = this.c.split(',');
    temp.opacityColor[3] = `${this.opacity})`;
    temp.radialGradient.addColorStop(0, temp.opacityColor.join(','));
    temp.opacityColor[3] = `${this.opacity * 0.4})`;
    temp.radialGradient.addColorStop(0.35, temp.opacityColor.join(','));
    temp.opacityColor[3] = 0;
    temp.radialGradient.addColorStop(1, temp.opacityColor.join(','));
    context.fillStyle = temp.radialGradient;
    context.fillRect(
      temp.viewportPixel.x - temp.widthOffsetPixels,
      temp.viewportPixel.y - temp.widthOffsetPixels,
      temp.widthPixels,
      temp.widthPixels
    );

    perf.stop('Particle._blur');
  }

  _circle(context) { perf.start('Particle._circle');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Particle._circle');
    context.beginPath();
    context.arc(
      temp.viewportPixel.x, temp.viewportPixel.y,
      this.length * $g.viewport.pixelsPerMeter,
      0,
      $g.constants.PI2
    );
    temp.opacityColor = this.c.split(',');
    temp.opacityColor[3] = `${this.opacity})`;
    context.fillStyle = temp.opacityColor.join(',');
    context.fill();

    perf.stop('Particle._circle');
  }

  runAnimate() {
    if (this.animate) {
      if (!this.originalLength) this.originalLength = this.length;
      if (!this.originalColor) this.originalColor = this.c;
      if (!this.originalOpacity) this.originalOpacity = this.opacity;
      this.animate();
    }
  }

  applyType(initialObj) { perf.start('Particle.applyType');
    Object.assign(this, cloneDeep(types[this.type]), initialObj);

    // don't let this value be overwritten by type
    this.c = color.toRGBA(this.c);
    // also update initialObj so it isn't overwritten
    initialObj.c = this.c;

    perf.stop('Particle.applyType');
  }

  factoryInit(initialObj) {
    this.frameCounter = 0;
    this.opacity = 1;
    this.originalLength = null; // track original length - to be set at the first animate call
    this.originalColor = null; // track original color - to be set at the first animate call
    this.originalOpacity = null; // track original opacity - to be set at the first animate call
    // set speed to sMax
    this.updateTrig();
    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;
  }
}

const types = {
  standard: {
    drawFunc: '_circle',
    c: '#fff',
    length: 1,
    animate: function() {
      this.frameCounter++;
      // shrink
      this.length = this.originalLength - (this.frameCounter * this.originalLength / this.animateFrames);
      // slow the particles
      this.sX = this.sX * .97;
      this.sY = this.sY * .97;
      this.opacity = this.originalOpacity - (this.originalOpacity * (this.frameCounter / this.animateFrames));
      if (this.frameCounter === this.animateFrames) this.remove();
    },
    animateFrames: 20,
  },
  flash: {
    drawFunc: '_blur',
    sMax: 0,
    c: 'rgba(255, 255, 255, 1)',
    length: 10,
    animate: function() {
      this.frameCounter++;
      // shrink over time
      this.length = this.originalLength - (this.frameCounter * this.originalLength / this.animateFrames);
      // fade over time
      this.opacity = this.originalOpacity - (this.originalOpacity * (this.frameCounter / this.animateFrames));
      if (this.frameCounter === this.animateFrames) this.remove();
    },
    animateFrames: 6,
  },

};
