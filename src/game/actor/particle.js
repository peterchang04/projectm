import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';
import decorate from '../decorator/decorate.js';
import { cloneDeep } from 'lodash';

const temp = {};

export default class Particle {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Particle.constructor');
    decorate.add(this, initialObj, ['entity', 'drawable', 'updatable', 'physics']);
    this.c = '#fff';

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
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Particle.drawMe');
    context.fillStyle = this.c;
    context.beginPath();
    context.arc(
      temp.viewportPixel.x, temp.viewportPixel.y,
      this.length * $g.viewport.pixelsPerMeter,
      0,
      $g.constants.PI2
    );
    context.fillStyle = this.c || '#fff';
    if (this.opacity) context.fillStyle = `rgba(255,255,255,${this.opacity})`;
    context.fill();

    if (this.trail) {
      for (let i = 0; i < this.trail; i++) {
        const opacityMod = this.opacity / (this.trail + 1);
        context.beginPath();
        context.arc(
          this.x - (this.distX * (i+1) * 2 * $g.viewport.pixelRatio),
          this.y - (this.distY * (i+1) * 2 * $g.viewport.pixelRatio),
          this.w * $g.viewport.pixelRatio / 2,
          0,
          physics.PI2
        );
        context.fillStyle = '#fff';
        if (this.opacity) context.fillStyle = `rgba(255,255,255,${this.opacity - (opacityMod * (i+1))})`;
        context.fill();
      }
    }
    perf.stop('Particle.drawMe');
  }

  runAnimate() {
    if (this.animate) this.animate();
  }

  applyType() { perf.start('Particle.applyType');
    Object.assign(this, cloneDeep(types[this.type]));

    perf.stop('Particle.applyType');
  }

  factoryInit() {
    this.frameCounter = 0;
    this.originalLength = this.length; // track original length
    this.originalColor = this.c;
    // set speed to sMax
    this.updateTrig();
    this.sX = this.dX * this.sMax;
    this.sY = this.dY * this.sMax;
  }
}

const types = {
  0: {
    name: 'standard',
    c: '#fff',
    length: 1,
    animate: function() {
      this.frameCounter++;
      this.length = this.originalLength - (this.frameCounter * this.originalLength / this.animateFrames);
      if (this.frameCounter === this.animateFrames) this.remove();
    },
    animateFrames: 20,
  },
  1: {
    name: 'flashFade',
    c: 'rgba(255, 255, 255, 1)',
    length: 10,
    animate: function() {
      this.frameCounter++;
      // shtink over time
      this.length = this.originalLength - (this.frameCounter * this.originalLength / this.animateFrames);
      // solve for opacity
      this.c = this.originalColor.replace('1', 1 - (this.frameCounter / this.animateFrames));
      if (this.frameCounter === this.animateFrames) this.remove();
    },
    animateFrames: 6,
  },

};
