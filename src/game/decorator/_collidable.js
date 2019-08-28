import $g from '../../utils/globals.js';
import perf from '../../utils/perf.js';
import maths from '../../utils/maths.js';
import SAT from 'sat';
import { cloneDeep } from 'lodash';

let temp = {};
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  isCollisionTest: true,
  longColliders: {}, // all other objects, occassionally test to see if
  midColliders: {}, // coordinates close enough to touch within X (10) frames
  shortColliders: {}, // coordinates within inner square
  exemptColliders: {}, // deemed to never collide again
};

function getProperties() {
  return properties;
}

function add(obj) { perf.start('_collidable.add');
  Object.assign(obj, cloneDeep(properties)); // merge properties

  // attach these functions
  obj.checkNewCollidee = checkNewCollidee;
  obj.initCollision = initCollision;
  obj.setupPolygon = setupPolygon;
  obj.testAllCollidees = testAllCollidees;
  obj.checkLongCollisions = checkLongCollisions;
  obj.checkMidCollisions = checkMidCollisions;
  obj.checkShortCollisions = checkShortCollisions;
  obj.updatePolygonDirection = updatePolygonDirection;
  obj.updatePolygonPosition = updatePolygonPosition;
  obj.drawCollisionPoints = drawCollisionPoints;

  /* priority 100+ so it runs after all movement has been calculated, checks long, mid, short in sequence */
  obj.addUpdate('checkLongCollisions', 100, 12);
  obj.addUpdate('checkMidCollisions', 101, 4);
  obj.addUpdate('checkShortCollisions', 102, 1);
  // updates when physics change direction
  obj.addUpdate('updatePolygonDirection', 1, 1);
  obj.addUpdate('updatePolygonPosition', 1, 1);

  // run this when obj is initialized
  obj.inits.push('initCollision');

  perf.stop('_collidable.add');
}

// look for new objects. Algorithm in a nutshell
function checkNewCollidee(collidee) { perf.start('_collidable.obj.checkNewCollidee');
  // check to see if in mid or short
  if (
    this.id === collidee.id // don't test self
    || this.exemptColliders[collidee.id] || this.longColliders[collidee.id] || this.midColliders[collidee.id] || this.shortColliders[collidee.id]
  ) return perf.stop('_collidable.obj.checkNewCollidee');;
  // start with everyone in longColliders
  this.longColliders[collidee.id] = collidee;
  if (checkLongCollide(this, this.longColliders[collidee.id])) {
    this.midColliders[collidee.id] = this.longColliders[collidee.id];
    delete this.longColliders[collidee.id];
    if (checkMidCollide(this, this.midColliders[collidee.id])) {
      this.shortColliders[collidee.id] = this.midColliders[collidee.id];
      delete this.midColliders[collidee.id];
      // at this point, the short check which runs every loop will pickup the new obj
    }
  }
   perf.stop('_collidable.obj.checkNewCollidee');
};

// called by update when direction changes
function updatePolygonDirection() { perf.start('_collidable.obj.updatePolygonDirection');
  if (this.Polygon.d !== this.d && this.Polygon) {
    // SAT.Polygon's angle system is different from projectm
    this.Polygon.d = this.d; // track what was last set
    this.Polygon.setAngle(maths.degreeToRadian(this.d + 90));
  }
  perf.stop('_collidable.obj.updatePolygonDirection');
};

// called by update when position changes
function updatePolygonPosition() { perf.start('_collidable.obj.updatePolygonPosition');
  if (this.Polygon && (this.Polygon.pos.x !== this.mX || this.Polygon.pos.y !== this.mY)) {
    // SAT.Polygon's angle system is different from projectm
    this.Polygon.pos.x = this.mX;
    this.Polygon.pos.y = this.mY;
  }
  perf.stop('_collidable.obj.updatePolygonPosition');
};

function drawCollisionPoints(context) { perf.start('_collidable.obj.drawCollisionPoints');
  if (!$g.constants.DRAWCOLLISION) return perf.stop('_collidable.obj.drawCollisionPoints');
  if (this.Polygon) {
    context.fillStyle = 'rgb(255,0,255)';

    this.Polygon.calcPoints.map((point) => {

      temp.viewportPixel = this.getViewportPixel(this.mX + point.x, this.mY + point.y);
      if (!temp.viewportPixel.isVisible) return;

      context.beginPath();
      context.arc(
        temp.viewportPixel.x,
        temp.viewportPixel.y,
        3,
        0,
        $g.constants.PI2
      );
      context.fill();
    });
  }

  perf.stop('_collidable.obj.drawCollisionPoints');
};

function initCollision(initialObj = {}) { perf.start('_collidable.obj.initCollision');
  // only init real, not factory stuff
  if (this.id in $g.game.actors || this.id in $g.game.projectiles) {
    // clear collision detection history
    this.longColliders = {};
    this.midColliders = {};
    this.shortColliders = {};
    this.exemptColliders = {};
    // retain exemptColliders being passed in
    if (initialObj.exemptColliders) this.exemptColliders = initialObj.exemptColliders;

    // take the new entity info and recalculate Polygon
    this.setupPolygon();
    this.testAllCollidees();
  }
  perf.stop('_collidable.obj.initCollision');
};

function setupPolygon() { perf.start('_collidable.obj.setupPolygon');
  if (!this.polygon) console.warn(`id:${this.id} all collidables should have a polygon`);
  if (this.polygon) { // initialize a polygon
    this.temp.vectors = [];
    // this.polygon must be counterclockwise starting closest to 11:59
    this.temp.vectorScale = this.length / 100;
    this.temp.vectors = this.polygon.map((point) => {
      return new SAT.Vector(point.x * this.temp.vectorScale, point.y * this.temp.vectorScale);
    });
    this.Polygon = new SAT.Polygon(new SAT.Vector(), this.temp.vectors);
  }
  perf.stop('_collidable.obj.setupPolygon');
};

function testAllCollidees() { perf.start('_collidable.obj.testAllCollidees');
  this.checkLongCollisions();
  this.checkMidCollisions();
  this.checkShortCollisions();
  perf.stop('_collidable.obj.testAllCollidees');
};

function checkLongCollisions() { perf.start('_collidable.obj.checkLongCollisions');
  // check for new actors
  Object.keys($g.game.actors).map((id) => {
    this.checkNewCollidee($g.game.actors[id]);
  });

  // check longColliders
  Object.keys(this.longColliders).map((id) => {
    // still a valid actor?
    if (!$g.game.actors[id]) return delete this.longColliders[id];
    // check long collide

    if (checkLongCollide(this, this.longColliders[id])) {
      this.midColliders[id] = this.longColliders[id];
      delete this.longColliders[id];
    }
  });

  perf.stop('_collidable.obj.checkLongCollisions');
};

function checkMidCollisions() { perf.start('_collidable.obj.checkMidCollisions');
  Object.keys(this.midColliders).map((id) => {
    // still a valid actor?
    if (!$g.game.actors[id]) return delete this.midColliders[id];
    // test to see if needs to be escalated to short, or de-escalated to long
    if (checkMidCollide(this, this.midColliders[id])) {
      this.shortColliders[id] = this.midColliders[id];
      delete this.midColliders[id];
    } else if (checkMidDeescalate(this, this.midColliders[id])) {
      // de-escalate?
      this.longColliders[id] = this.midColliders[id];
      delete this.midColliders[id];
    }
  });
  perf.stop('_collidable.obj.checkMidCollisions');
};

function checkShortCollisions() { perf.start('_collidable.obj.checkShortCollisions');
  Object.keys(this.shortColliders).map((id) => {
    // still a valid actor?
    if (!$g.game.actors[id]) return delete this.shortColliders[id];
    // test to see if collided, or de-escalate to mid
    if (checkShortCollide(this, this.shortColliders[id])) {
      if (this.onCollide) {
        this.onCollide(this.shortColliders[id]);
      } else {
        console.warn(`${this.class} tests for collision and should have a onCollide(collidee) function`);
      }
    } else if (checkShortDeescalate(this, this.shortColliders[id])) {
      // de-escalate
      this.midColliders[id] = this.shortColliders[id];
      delete this.shortColliders[id];
    }
  });
  perf.stop('_collidable.obj.checkShortCollisions');
}

function checkLongCollide(obj, obj2) { perf.start('_collidable.checkLongCollide');
  temp.xDist = Math.abs(obj.mX - obj2.mX);
  temp.yDist = Math.abs(obj.mY - obj2.mY);
  temp.xMaxDist = obj.length + obj2.length + Math.abs(obj.sX * 0.2 /* full width of objs + 0.2 is rougly 12 frames away */);
  temp.yMaxDist = obj.length + obj2.length + Math.abs(obj.sY * 0.2 /* full width of objs + 0.2 is rougly 12 frames away */);

  temp.isCollide = (
    temp.xDist < temp.xMaxDist
    && temp.yDist < temp.yMaxDist
  );
  perf.stop('_collidable.checkLongCollide');
  return temp.isCollide;
}

function checkMidCollide(obj, obj2) { perf.start('_collidable.checkMidCollide');
  temp.isCollide = (
    Math.abs(obj.mX - obj2.mX) < (obj.length / 2) + (obj2.length / 2)
    && Math.abs(obj.mY - obj2.mY) < (obj.length / 2) + (obj2.length / 2)
  );
  perf.stop('_collidable.checkMidCollide');
  return temp.isCollide;
}

function checkMidDeescalate(obj, obj2) { perf.start('_collidable.checkMidDeescalate');
  temp.xDist = Math.abs(obj.mX - obj2.mX);
  temp.yDist = Math.abs(obj.mY - obj2.mY);
  temp.xMaxDist = 10 + obj.length + obj2.length + Math.abs(obj.sX * 0.2 /* full width of objs + 0.2 is rougly 24 frames away */);
  temp.yMaxDist = 10 + obj.length + obj2.length + Math.abs(obj.sY * 0.2 /* full width of objs + 0.2 is rougly 24 frames away */);

  // more than what it took to get into midColliders
  temp.isCollide = (
    temp.xDist > temp.xMaxDist
    && temp.yDist > temp.yMaxDist
  );
  perf.stop('_collidable.checkMidDeescalate');
  return temp.isDeescalate;
}

function checkShortCollide(obj, obj2) { perf.start('_collidable.checkShortCollide');
  temp.isCollide = SAT.testPolygonPolygon(obj.Polygon, obj2.Polygon);
  perf.stop('_collidable.checkShortCollide');
  return temp.isCollide;
}

function checkShortDeescalate(obj, obj2) { perf.start('_collidable.checkShortDeescalate');
  temp.isDeescalate = (
    // deescalate range is twice what it took to get into shortColliders, to avoid bouncing back and forth
    Math.abs(obj.mX - obj2.mX) > obj.length + obj2.length
    || Math.abs(obj.mY - obj2.mY) > obj.length + obj2.length
  );
  perf.stop('_collidable.checkShortDeescalate');
  return temp.isDeescalate;
}

export default { add, getProperties };
