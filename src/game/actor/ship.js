import physics from '../decorator/_physics.js';
import drawable from '../decorator/_drawable.js';
import shipThrust from '../decorator/_shipThrust.js';
import shipWeapons from '../decorator/_shipWeapons.js';
import collidable from '../decorator/_collidable.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Ship {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Ship.constructor');
    this.class = 'Ship';
    this.isCollidable = true;
    Object.assign(this, initialObj);

    drawable.add(this);
    this.applyType();
    physics.add(this);
    shipThrust.add(this);
    shipWeapons.add(this);
    collidable.add(this);
    this.setupPolygon();

    // myShip logic
    if (this.id === 0) {
      this.addDraw('drawMyShip', 1, 'canvas_myShip');
      this.addDraw('drawCollisionPoints', 100, 'canvas_myShip'); // overwrite the original from _collision.js which specifies canvas_actors

      // override _collision.drawCollisionPoints
      this.drawCollisionPoints = function(context) { perf.start('_myShip.obj.drawCollisionPoints');
        if (context.canvas.id !== 'canvas_myShip') return;
        if (this.Polygon) {
          context.fillStyle = 'rgb(255,0,255)';
          this.temp.scale = (context.canvas.width / $g.constants.SQRT2) / 100;
          this.polygon.map((point) => {
            context.beginPath();
            context.arc(
              (context.canvas.width / 2) + (this.temp.scale * point.x),
              (context.canvas.width / 2) - (this.temp.scale * point.y),
              3,
              0,
              $g.constants.PI2
            );
            context.fill();
          });
        }

        perf.stop('_myShip.obj.drawCollisionPoints');
      };
    }

    perf.stop('Ship.constructor');
  }

  // add a fn to the draws queue
  drawMyShip(context) {
    if (context.canvas.id !== 'canvas_myShip') return;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    canvasSvg.draw(context, {
      svg: 'MyShipSVG',
      id: this.id,
      d: 0,
      pixelLength: this.length * $g.viewport.pixelsPerMeter,
      x: context.canvas.width / 2,
      y: context.canvas.height / 2
    });
  };

  onCollide() {
    return true;
  }

  applyType() { perf.start('Ship.applyType');
    Object.assign(this, shipTypes[this.type]);
    perf.stop('Ship.applyType');
  }
}

const shipTypes = {
  0: { // 0
    sMaxShip: 50, // this is the ship max speed value and fixed. sMax will vary depending on thrust
    sMax: 40,
    aSMax: 1,
    length: 20,
    mass: 80000, // kg
    polygon: [ // 100 x 100, but with middle at 0, so -50 -> 50 bounds
      { x: -4, y: 48, },
      { x: -29, y: -30 },
      { x: -18, y: -45 },
      // other side
      { x: 18, y: -45 },
      { x: 29, y: -30 },
      { x: 4, y: 48 }
    ],
  }
};
