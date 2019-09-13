import decorate from '../decorator/decorate.js';
import compositeSvg from '../../utils/compositeSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';
import { shipTypes } from '../../definitions.js';

const temp = {};

export default class Ship {
  constructor(initialObj = {}) { perf.start('Ship.constructor');
    const decoratorList = ['entity', 'drawable', 'settersAndHooks', 'updatable', 'physics', 'collidable', 'shipThrust', 'shipWeapons', 'shipTargeting'];
    decorate.add(this, initialObj, decoratorList);
    this.name = `S-${this.id}`;
    this.svgComposites = ['target', 'turrets', 'rotate'];

    this.applyType();

    this.addDraw('drawForwardThrust', 1, 'canvas_actors');
    this.addDraw('drawMe', 2, 'canvas_actors');
    this.addDraw('drawBackwardThrust', 3, 'canvas_actors');
    this.addDraw('drawAngularThrust', 3, 'canvas_actors');
    this.addDraw('drawCollisionPoints', 100);

    perf.stop('Ship.constructor');
  }

  // add a fn to the draws queue
  drawMe(context) { perf.start('Ship.drawMe');
    temp.viewportPixel = this.getViewportPixel(this.mX, this.mY, this.length);
    if (!temp.viewportPixel.isVisible && $g.game.myShip.targets.indexOf(this.id) === -1) return perf.stop('Ship.drawMe');

    compositeSvg.draw(context, this, temp.viewportPixel.x, temp.viewportPixel.y);

    perf.stop('Ship.drawMe');
  };

  drawForwardThrust(context) { perf.start('Ship.drawForwardThrust');
    if (this.thrustForce > 0) {
      // figure out opacity
      temp.opacity = (0.5 * this.thrustPercent) + 0.5; // 0.5 - 1 opacity
      temp.opacityColor = 'rgba(147,230,255,1)'.split(',');

      // draw for each thruster
      this.thrusters.forward.map((thruster) => {
        // find thrustWidth by thrusterValue
        temp.thrustWidth = ((thruster.wMax - thruster.wMin) * this.thrustPercent) + thruster.wMin;
        // scale to ship length
        temp.thrustWidth = temp.thrustWidth * (this.length / 100);
        // scale to screen
        temp.thrustWidth = temp.thrustWidth * $g.viewport.pixelsPerMeter;

        temp.viewportPixel = this.getViewportPixel(
          this.mX + (thruster.x * this.length / 100),
          this.mY + (thruster.y * this.length / 100),
          temp.thrustWidth,
          (this.id == $g.game.myShip.id)
        );

        // create the gradient
        temp.radialGradient = context.createRadialGradient(temp.viewportPixel.x, temp.viewportPixel.y, 0, temp.viewportPixel.x, temp.viewportPixel.y, temp.thrustWidth / 2);
        temp.opacityColor[3] = `${temp.opacity})`;
        temp.radialGradient.addColorStop(0, temp.opacityColor.join(','));
        temp.opacityColor[3] = `${temp.opacity * 0.4})`;
        temp.radialGradient.addColorStop(0.35, temp.opacityColor.join(','));
        temp.opacityColor[3] = 0;
        temp.radialGradient.addColorStop(1, temp.opacityColor.join(','));
        context.fillStyle = temp.radialGradient;

        context.fillRect(
          temp.viewportPixel.x - (temp.thrustWidth / 2),
          temp.viewportPixel.y - (temp.thrustWidth / 2),
          temp.thrustWidth,
          temp.thrustWidth
        );

      });
    }
    perf.stop('Ship.drawForwardThrust');
  }

  drawBackwardThrust(context) { perf.start('Ship.drawBackwardThrust');
    if (this.thrustForce < 0) {
      // figure out opacity
      temp.opacity = (0.5 * Math.abs(this.thrustPercent)) + 0.5; // 0.5 - 1 opacity
      temp.opacityColor = 'rgba(147,230,255,1)'.split(',');

      // draw for each thruster
      this.thrusters.backward.map((thruster) => {
        // find thrustWidth by thrusterValue
        temp.thrustWidth = ((thruster.wMax - thruster.wMin) * Math.abs(this.thrustPercent)) + thruster.wMin;
        // scale to ship length
        temp.thrustWidth = temp.thrustWidth * (this.length / 100);
        // scale to screen
        temp.thrustWidth = temp.thrustWidth * $g.viewport.pixelsPerMeter;

        temp.viewportPixel = this.getViewportPixel(
          this.mX + (thruster.x * this.length / 100),
          this.mY + (thruster.y * this.length / 100),
          temp.thrustWidth,
          (this.id == $g.game.myShip.id)
        );

        // create the gradient
        temp.radialGradient = context.createRadialGradient(temp.viewportPixel.x, temp.viewportPixel.y, 0, temp.viewportPixel.x, temp.viewportPixel.y, temp.thrustWidth / 2);
        temp.opacityColor[3] = `${temp.opacity})`;
        temp.radialGradient.addColorStop(0, temp.opacityColor.join(','));
        temp.opacityColor[3] = `${temp.opacity * 0.4})`;
        temp.radialGradient.addColorStop(0.35, temp.opacityColor.join(','));
        temp.opacityColor[3] = 0;
        temp.radialGradient.addColorStop(1, temp.opacityColor.join(','));
        context.fillStyle = temp.radialGradient;
        context.fillRect(
          temp.viewportPixel.x - (temp.thrustWidth / 2),
          temp.viewportPixel.y - (temp.thrustWidth / 2),
          temp.thrustWidth,
          temp.thrustWidth
        );
      });
    }
    perf.stop('Ship.drawBackwardThrust');
  }

  drawAngularThrust(context) { perf.start('Ship.drawAngularThrust');
    temp.thrusters = [];
    if (this.aA < 0) {
      // figure out opacity
      temp.percent = Math.abs(this.aA * 2) / this.aSMax;
      temp.opacity = (0.5 * temp.percent) + 0.5; // 0.5 - 1 opacity
      temp.opacityColor = 'rgba(147,230,255,1)'.split(',');
      // which thrusters are firing when turning left
      temp.thrusters.push(this.thrusters.rightForward);
      temp.thrusters.push(this.thrusters.leftBackward);
    } else if (this.aA > 0) {
      // figure out opacity
      temp.percent = Math.abs(this.aA * 2) / this.aSMax;
      temp.opacity = (0.5 * temp.percent) + 0.5; // 0.5 - 1 opacity
      temp.opacityColor = 'rgba(147,230,255,1)'.split(',');
      // which thrusters are firing when turning right
      temp.thrusters.push(this.thrusters.leftForward);
      temp.thrusters.push(this.thrusters.rightBackward);
    }
    // draw for each thruster
    temp.thrusters.map((thruster) => {
      // find thrustWidth by thrusterValue
      temp.thrustWidth = ((thruster.wMax - thruster.wMin) * temp.percent) + thruster.wMin;
      // scale to ship length
      temp.thrustWidth = temp.thrustWidth * (this.length / 100);
      // scale to screen
      temp.thrustWidth = temp.thrustWidth * $g.viewport.pixelsPerMeter;

      temp.viewportPixel = this.getViewportPixel(
        this.mX + (thruster.x * this.length / 100),
        this.mY + (thruster.y * this.length / 100),
        temp.thrustWidth,
        (this.id == $g.game.myShip.id)
      );

      // create the gradient
      temp.radialGradient = context.createRadialGradient(temp.viewportPixel.x, temp.viewportPixel.y, 0, temp.viewportPixel.x, temp.viewportPixel.y, temp.thrustWidth / 2);
      temp.opacityColor[3] = `${temp.opacity})`;
      temp.radialGradient.addColorStop(0, temp.opacityColor.join(','));
      temp.opacityColor[3] = `${temp.opacity * 0.4})`;
      temp.radialGradient.addColorStop(0.35, temp.opacityColor.join(','));
      temp.opacityColor[3] = 0;
      temp.radialGradient.addColorStop(1, temp.opacityColor.join(','));
      context.fillStyle = temp.radialGradient;
      context.fillRect(
        temp.viewportPixel.x - (temp.thrustWidth / 2),
        temp.viewportPixel.y - (temp.thrustWidth / 2),
        temp.thrustWidth,
        temp.thrustWidth
      );
    });
    perf.stop('Ship.drawAngularThrust');
  }

  onCollide() { perf.start('Ship.onCollide');
    // console.log('ship collide!');
    return perf.stop('Ship.onCollide');;
  }

  applyType() { perf.start('Ship.applyType');
    Object.assign(this, shipTypes[this.type]);
    perf.stop('Ship.applyType');
  }
}
