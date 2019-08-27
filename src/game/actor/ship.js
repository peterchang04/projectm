import decorate from '../decorator/decorate.js';
import canvasSvg from '../../utils/canvasSvg.js';
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';

const temp = {};

export default class Ship {
  constructor(initialObj = {}) { /* e.g. { x,y,w,h,d,s } */ perf.start('Ship.constructor');
    const decoratorList = ['entity', 'drawable', 'settersAndHooks', 'updatable', 'physics', 'collidable', 'shipThrust', 'shipWeapons'];
    decorate.add(this, initialObj, decoratorList);

    this.applyType();

    // myShip logic
    if (this.id === 0) {
      // attach function to obj
      this.drawCollisionPoints = drawMyShipCollisionPoints;

      this.addDraw('drawMyShip', 1, 'canvas_myShip');
      this.addDraw('drawCollisionPoints', 100, 'canvas_myShip'); // overwrite the original from _collision.js which specifies canvas_actors
    }

    perf.stop('Ship.constructor');
  }

  // add a fn to the draws queue
  drawMyShip(context) { perf.start('Ship.drawMyShip');
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
    perf.stop('Ship.drawMyShip');
  };

  onCollide() { perf.start('Ship.onCollide');
    return perf.stop('Ship.onCollide');;
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

// override _collision.drawCollisionPoints NOT a class function, which would then apply to all ships
function drawMyShipCollisionPoints(context) { perf.start('_myShip.obj.drawMyShipCollisionPoints');
  if (!$g.constants.DRAWCOLLISION) return;
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

  perf.stop('_myShip.obj.drawMyShipCollisionPoints');
};
