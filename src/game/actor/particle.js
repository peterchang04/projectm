import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';
import decorate from '../decorator/decorate.js';

export default class Particle {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Particle.constructor');
    decorate.add(this, initialObj, ['entity', 'drawable', 'updatable']);
    this.c = '#fff';

    this.addDraw('drawMe');
    perf.stop('Particle.constructor');
  }

  drawMe(context) { perf.start('Particle.drawMe');
    context.beginPath();
    context.arc(
      this.x, this.y,
      this.w * $g.viewport.pixelRatio / 2,
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
}
