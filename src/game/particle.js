import physics from './_physics.js';
import drawable from './_drawable.js';

export default class Particle {
  constructor(initialObj = {}) { // e.g. { x,y,w,h,d,s }
    // set initial values
    for (const key in initialObj) {
      this[key] = initialObj[key];
    }
    drawable.add(this);
    physics.add(this);
  }
}
