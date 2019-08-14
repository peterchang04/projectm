// translates ship settings (throttle, energy settings, into physics outputs)
import perf from '../../utils/perf.js';
import $g from '../../utils/globals.js';

const temp = {}; // memory pointer to avoid allocation for new variables

function add(obj) { perf.start('_shipSystems.add');
  obj.thrustValue = 0; // position of thruster slider. (-25 --> 100)
  obj.decelerationSystem = true; // decelerates in the absence of thrust

  // more thrust eq more force (eq more speed)
  obj.updateForceByThrustValue = function(elapsedSec, updateCount) { perf.start('_shipSystems.obj.updateForceByThrustValue');
    // thrustValue is up to 100.
    temp.metersPerSecondAcceleration = 8; // how fast to accelerate
    this.thrustForce = (this.thrustValue / 100) * this.mass * temp.metersPerSecondAcceleration; // can be negative if reversing
    // adjust for direction
    this.forceY = this.dY * this.thrustForce;
    this.forceX = this.dX * this.thrustForce;

    // shut off force if past sMax
    if (this.sMaxX > 0 && this.sX > this.sMaxX) this.forceX = 0;
    if (this.sMaxX < 0 && this.sX < this.sMaxX) this.forceX = 0;
    if (this.sMaxY > 0 && this.sY > this.sMaxY) this.forceY = 0;
    if (this.sMaxY < 0 && this.sY < this.sMaxY) this.forceY = 0;

    perf.stop('_shipSystems.obj.updateForceByThrustValue');
  };

  // cap max speed by thrust value
  obj.updateMaxSpeedByThrustValue = function() { perf.start('_shipSystems.obj.updateMaxSpeedByThrustValue');
    // max speed is 20% - 100% depending on thrustValue 0-100
    temp.thrustMaxSpeedRatio = Math.abs(obj.thrustValue / 100) * 0.8; // max is .8
    temp.thrustMaxSpeedRatio += 0.2; // now its 20%-100%
    this.sMax = this.sMaxShip * temp.thrustMaxSpeedRatio;

    this.sMaxX = this.sMax * this.dX;
    this.sMaxY = this.sMax * this.dY;

    // when in reverse...
    if (this.thrustForce < 0) {
      this.sMaxX = this.sMaxX * -1;
      this.sMaxY = this.sMaxY * -1;
    }

    // otherwise, sMax stuck at 8 when no thrust.
    if (this.thrustForce === 0) this.sMax = 0;

    perf.stop('_shipSystems.obj.updateMaxSpeedByThrustValue');
  }

  // a readout of speed. Based on direction
  obj.calculateSpeed = function(elapsedSec, updateCount) { perf.start('_shipSystems.obj.calculateSpeed');
    if (updateCount % 10 !== 0) { // only run updateSpeedByThrust every 4th update. Fewer calculations
      perf.stop('_shipSystems.obj.calculateSpeed');
      return;
    }

    temp.sXRatio = this.dX * this.sX;
    temp.sYRatio = this.dY * this.sY;

    this.s = temp.sXRatio + temp.sYRatio;

    perf.stop('_shipSystems.obj.calculateSpeed');
  };

  // register update functions
  obj.updates.push('updateForceByThrustValue');
  obj.updates.push('updateMaxSpeedByThrustValue');
  obj.updates.push('calculateSpeed');

  perf.stop('_shipSystems.add');
}

export default { add };
