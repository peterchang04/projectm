import decorate from '../decorator/decorate.js';
import perf from '../../utils/perf.js';
import maths from '../../utils/maths.js';
import $g from '../../utils/globals.js';
import compositeSvg from '../../utils/compositeSvg.js';
import { torpedoTypes } from '../../definitions.js';

const temp = {};

export default class Torpedo {
  constructor(initialObj = { d: 0, sMax: 0, type: 'explosive' }) { /* e.g. { x,y,w,h,d,s } */ perf.start('Torpedo.constructor');
    decorate.add(this, initialObj, ['entity', 'drawable', 'updatable', 'physics', 'collidable', 'shipThrust', 'settersAndHooks']);
    this.svgComposites = ['target', 'rotate'];

    this.addUpdate('removeByDistance', 100, 10);
    this.addUpdate('updateTargetDirection', 100, 12);
    this.addUpdate('updateSimpleDirection', 1, 3);
    this.inits.push('factoryInit');

    // get rid of unneeded functions
    this.removeUpdate('applyResistanceForce');
    this.removeUpdate('setAngularThrust'); // use simple turning for torpedo

    // add to draw queue
    this.addDraw('drawMe');
    // this.addDraw('drawTargetPrediction_TEST'); For testing seeking

    perf.stop('Torpedo.constructor');
  }

  onCollide(collidee, response) { perf.start('Torpedo.onCollide');
    if (this.collisionEffect) collisionEffects[this.collisionEffect](this, collidee);
    this.remove();
    perf.stop('Torpedo.onCollide');
  }

  // add a fn to the draws queue
  drawMe(context) { perf.start('Torpedo.drawMe');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible) return perf.stop('Torpedo.drawMe');

    compositeSvg.draw(context, this, temp.viewportPixel.x, temp.viewportPixel.y);

    perf.stop('Torpedo.drawMe');
  };

  drawTargetPrediction_TEST(context) { perf.start('Torpedo.drawMe');
    if (!this.target || !$g.game.actors[this.target]) return;
    if (this.mXTarget && this.mYTarget) {
      $g.bank.getParticle({ mX: this.mXTarget, mY: this.mYTarget, type: 'flash' });
    }

    if (this.frameCounter === undefined) this.frameCounter = 0;
    this.frameCounter++;

    if (this.dMomentum !== undefined && (this.frameCounter % 3) === 0) {
      $g.bank.getProjectile({
        type: '50mm',
        d: this.dMomentum,
        mX: this.mX,
        mY: this.mY,
        sMax: 800,
        maxDistance: 50,
        exemptColliders: { [`${this.id}`]: this },
      });
    }

    if (this.dTarget !== undefined && (this.frameCounter % 3) === 1) {
      $g.bank.getProjectile({
        type: '50mm',
        d: this.dTarget,
        mX: this.mX,
        mY: this.mY,
        sMax: 800,
        maxDistance: 50,
        c: '#ff0000',
        exemptColliders: { [`${this.id}`]: this },
      });
    }

    if ((this.frameCounter % 3) === 2) {
      $g.bank.getProjectile({
        type: '50mm',
        d: this.d + this.dTurn,
        mX: this.mX,
        mY: this.mY,
        sMax: 800,
        maxDistance: 150,
        c: '#ffffff',
        exemptColliders: { [`${this.id}`]: this },
      });
    }

    perf.stop('Torpedo.drawMe');
  };

  removeByDistance(elapsed) { perf.start('Torpedo.removeByDistance');
    if (maths.getDistance(this.mXStart, this.mYStart, this.mX, this.mY) > this.maxDistance) {
      this.remove();
    }
    perf.stop('Torpedo.removeByDistance');
  }

  updateTargetDirection(elapsed) { perf.start('Torpedo.updateTargetDirection');
    if (this.target === null || this.target === undefined || !$g.game.actors[this.target]) return perf.stop('Torpedo.updateTargetDirection');; // no target
    if (!this.thrustValue) return perf.stop('Torpedo.updateTargetDirection'); // hasn't engaged yet

    // predict how long until impact at sMax    if (!this.thrustValue) return perf.stop('Torpedo.updateTargetDirection');; // hasn't engaged yet
    temp.dist = maths.getDistance(this.mX, this.mY, $g.game.actors[this.target].mX, $g.game.actors[this.target].mY);
    temp.timeToTarget = temp.dist / this.sMaxShip; // speed of projectile.
    // how long will it take to accelerate to max speed?
    temp.timeToAccelerate = (this.sMaxShip - this.s) / this.aMax;
    temp.timeToTarget += (temp.timeToAccelerate * .75);

    // eventual target location
    this.mXTarget = $g.game.actors[this.target].mX + (temp.timeToTarget * $g.game.actors[this.target].sX);
    this.mYTarget = $g.game.actors[this.target].mY + (temp.timeToTarget * $g.game.actors[this.target].sY);

    // get the direction of eventual target
    this.dTarget = maths.getDegree2P(this.mX, this.mY, this.mXTarget, this.mYTarget);
    // get the current momentum direction
    this.dMomentum = maths.getDegree2P(0, 0, this.sX, this.sY);
    // get how much momentum still has to change
    this.momentumTargetDiff = maths.getRotation(this.dMomentum, this.dTarget);

    temp.dOverturn = Math.abs(this.momentumTargetDiff); // as we approach momentum = target, reduce the amount of overturn
    if (temp.dOverturn > 45) temp.dOverturn = 45;

    if (this.momentumTargetDiff > 0) {
      // right turn
      this.dTurn = maths.getRotation(this.d, this.dTarget) + temp.dOverturn;
    } else {
      // left turn
      this.dTurn = maths.getRotation(this.d, this.dTarget) - temp.dOverturn;
    }

    perf.stop('Torpedo.updateTargetDirection');
  }

  factoryInit(initialObj) { perf.start('Torpedo.factoryInit');
    // set speed to sMax
    this.d = initialObj.d;
    this.updateTrig();
    this.forceX = this.dX * this.forceThrust;
    this.forceY = this.dY * this.forceThrust;
    this.thrustValue = 0;
    this.sX = 0;
    this.sY = 0;
    this.dTurn = 0;
    this.aS = 0;
    this.dTurnAdjust = 0;

    // wait a second then start thrusting
    clearTimeout(this.thrustTimer);
    this.thrustTimer = setTimeout(() => {
      this.thrustValue = 100;
    }, 1500);

    perf.stop('Torpedo.factoryInit');
  }

  applyType(initialObj) { perf.start('Torpedo.applyType');
    Object.assign(this, torpedoTypes[this.type], initialObj);

    // record beginning mX mY
    this.mXStart = this.mX;
    this.mYStart = this.mY;

    perf.stop('Torpedo.applyType');
  }
}

const collisionEffects = {
  explosion_1: (torpedo, collidee) => {
    // 3 center explosions
    $g.bank.getParticle({
      c: '#f5c93244',
      mX: torpedo.mX + (maths.random(-10, 10) / 5),
      mY: torpedo.mY + (maths.random(-10, 10) / 5),
      type: 'flash',
      length: maths.random(30, 50),
      animateFrames: 32
    });
    $g.bank.getParticle({
      c: '#fff85566',
      mX: torpedo.mX + (maths.random(-10, 10) / 5),
      mY: torpedo.mY + (maths.random(-10, 10) / 5),
      type: 'flash',
      length: maths.random(30, 50),
      animateFrames: 26
    });
    $g.bank.getParticle({
      c: '#ffcb5c88',
      mX: torpedo.mX + (maths.random(-10, 10) / 5),
      mY: torpedo.mY + (maths.random(-10, 10) / 5),
      type: 'flash',
      length: maths.random(50, 80),
      animateFrames: 9
    });
    // 5 sparks
    for (temp.i = 0; temp.i < 20; temp.i++) {
      $g.bank.getParticle({
        d: maths.random(0, 360), // opposite of projectile, with a bit of random spread
        mX: torpedo.mX, mY: torpedo.mY,
        sMax: maths.random(50, 90),
        type: 'standard',
        c: '#ffbd49',
        animateFrames: maths.random(20, 100),
      });
    }
  }
};
