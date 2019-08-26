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

  obj.resetCollision = function() {
    this.longColliders = {};
    this.midColliders = {};
    this.shortColliders = {};
    this.exemptColliders = {};
  };

  obj.initCollision = function(initialObj = {}) {
    // only init real, not factory stuff
    if (this.id in $g.game.actors || this.id in $g.game.projectiles) {
      // clear collision detection history
      this.resetCollision();
      // retain exemptColliders being passed in
      if (initialObj.exemptColliders) this.exemptColliders = initialObj.exemptColliders;

      // take the new entity info and recalculate Polygon
      this.setupPolygon();
      this.testAllCollidees();
    }
  };

  obj.setupPolygon = function() {
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
  };

  obj.testAllCollidees = function() {
    this.checkLongCollisions();
    this.checkMidCollisions();
    this.checkShortCollisions();
  };

  // look for new objects. Algorithm in a nutshell
  obj.checkNewCollidee = function(collidee) {
    // check to see if in mid or short
    if (this.exemptColliders[collidee.id] || this.longColliders[collidee.id] || this.midColliders[collidee.id] || this.shortColliders[collidee.id]) return;
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
  };

  obj.checkLongCollisions = function() { perf.start('_collidable.obj.checkLongCollisions');
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

  obj.checkMidCollisions = function() { perf.start('_collidable.obj.checkMidCollisions');
    Object.keys(this.midColliders).map((id) => {
      // still a valid actor?
      if (!$g.game.actors[id]) return delete this.midColliders[id];
      // test to see if needs to be escalated to short, or de-escalated to long
      if (checkMidCollide(this, this.midColliders[id])) {
        this.shortColliders[id] = this.midColliders[id];
        delete this.midColliders[id];
      } else if (checkMidDeescalate(this, this.midColliders[id])) {
        // de-escalate?

      }
    });
    perf.stop('_collidable.obj.checkMidCollisions');
  };

  obj.checkShortCollisions = function() { perf.start('_collidable.obj.checkShortCollisions');
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
        delete this.shortColiders[id];
      }
    });
    perf.stop('_collidable.obj.checkShortCollisions');
  }

  obj.updateCollidableDirection = function() { perf.start('_collidable.obj.updateCollidableDirection');
    if (this.dLast !== this.d && this.Polygon) {
      // SAT.Polygon's angle system is different from projectm
      this.Polygon.setAngle(maths.degreeToRadian(this.d + 90));
    }
    perf.stop('_collidable.obj.updateCollidableDirection');
  };

  obj.drawCollisionPoints = function(context) { perf.start('_collidable.obj.drawCollisionPoints');
    if (this.Polygon) {
      context.fillStyle = 'rgb(255,0,255)';
      // solve for distance from myShip by coordinate
      this.temp.pixelDistX = (this.mX * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mX * $g.viewport.pixelsPerMeter);
      this.temp.pixelDistY = (this.mY * $g.viewport.pixelsPerMeter) - ($g.game.myShip.mY * $g.viewport.pixelsPerMeter);

      // translate this point by myShip rotation (https://academo.org/demos/rotation-about-point/)
      this.temp.pixelDistXPrime = (this.temp.pixelDistX * $g.game.myShip.dY) - (this.temp.pixelDistY * $g.game.myShip.dX);
      this.temp.pixelDistYPrime = (this.temp.pixelDistY * $g.game.myShip.dY) + (this.temp.pixelDistX * $g.game.myShip.dX);

      // see if it's off screen
      if (Math.abs(this.temp.pixelDistXPrime) > $g.viewport.pixelWidth || Math.abs(this.temp.pixelDistYPrime) > $g.viewport.pixelHeight) {
        perf.stop('_collidable.obj.drawCollisionPoints');
        return;
      }

      this.temp.scale = (this.length / 2) / 50;
      this.Polygon.calcPoints.map((point) => {
        context.beginPath();
        context.arc(
          $g.viewport.shipPixelX + this.temp.pixelDistXPrime + (point.x * $g.viewport.pixelsPerMeter),
          $g.viewport.shipPixelY - this.temp.pixelDistYPrime - (point.y * $g.viewport.pixelsPerMeter),
          3,
          0,
          $g.constants.PI2
        );
        context.fill();
      });
    }

    perf.stop('_collidable.obj.drawCollisionPoints');
  };

  /* priority 100+ so it runs after all movement has been calculated, checks long, mid, short in sequence */
  obj.addUpdate('checkLongCollisions', 100, 12);
  obj.addUpdate('checkMidCollisions', 101, 4);
  obj.addUpdate('checkShortCollisions', 102, 1);
  obj.addUpdate('updateCollidableDirection', 1, 1);
  obj.inits.push('initCollision');

  perf.stop('_collidable.add');
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
  perf.start('_collidable.checkMidDeescalate');
}

function checkShortCollide(obj, obj2) { perf.start('_collidable.checkShortCollide');
  // TODO: for now, short collide always returns true. - eventually, box or circle models
  temp.isCollide = true;
  perf.stop('_collidable.checkShortCollide');
  return temp.isCollide;
}

function checkShortDeescalate(obj, obj2) { perf.start('_collidable.checkShortDeescalate');
  return false;
  perf.start('_collidable.checkShortDeescalate');
}

export default { add, getProperties };
