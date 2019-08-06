// translates ship settings (throttle, energy settings, into physics outputs)
import perf from '../../utils/perf.js';

const temp = {}; // memory pointer to avoid allocation for new variables

function add(obj) { let p = perf.start('_shipSystems.add');
  obj.thrustValue = 0; // position of thruster slider. (-25 --> 100)
  obj.decelerationSystem = true; // decelerates in the absence of thrust

  obj.updateAccelerationByThrustValue = function() { perf.start('_shipSystems.obj.updateAccelerationByThrustValue');
    // translate thrust slider value to acceleration (considering energy allocation)
    this.a = (obj.thrustValue / 100) * obj.aMax;

    // tone down acceleration as we approach max speed
    temp.maxSpeedRatio = Math.abs(obj.s / obj.sMax);
    // tweak the linear to avoid infinite hyperbolic curve
    temp.maxSpeedRatio -= 0.2;
    temp.maxSpeedRatio = (temp.maxSpeedRatio < 0) ? 0 : temp.maxSpeedRatio; // don't let it be less than zero
    this.a = this.a * (1 - temp.maxSpeedRatio);

    // enforce sMax by stopping acc
    if (this.thrustValue > 0 && this.s >= this.sMax) { // can't acc further if sMax attained
      this.a = 0;
    } else if (this.thrustValue < 0 && this.s < (this.sMax * -1)) {
      this.a = 0;
    }

    perf.stop('_shipSystems.obj.updateAccelerationByThrustValue', p);
  };

  obj.updateMaxSpeedByThrustValue = function() { perf.start('_shipSystems.obj.updateMaxSpeedByThrustValue');
    // max speed is 20% - 100% depending on thrustValue 0-100
    temp.thrustRatio = Math.abs(obj.thrustValue / 100) * 0.8; // max is .8
    temp.thrustRatio += 0.2; // now its 20%-100%
    this.sMax = this.sMaxShip * temp.thrustRatio;

    perf.stop('_shipSystems.obj.updateMaxSpeedByThrustValue', p);
  }

  obj.updateDeceleration = function() { perf.start('_shipSystems.obj.updateDeceleration');
    // automatically stop ship when thrustValue set to zero
    if (this.thrustValue === 0 && this.s !== 0) {
      // should take 10 seconds to slow to zero
      this.a = this.s / -10;

      // make it jump to zero so it doesn't 'overshoot'
      if (Math.abs(this.s) < .2) {
        this.a = 0;
        this.s = 0;
      }
    }
    perf.stop('_shipSystems.obj.updateDeceleration', p);
  }

  // register update functions
  obj.updates.push('updateAccelerationByThrustValue');
  obj.updates.push('updateMaxSpeedByThrustValue');
  obj.updates.push('updateDeceleration');

  perf.stop('_shipSystems.add', p);
}

export default { add };
