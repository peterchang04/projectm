let activate = false;
let logs = {};
let now = null;
let metrics = {};

let start = function() { return; };
let stop = function() { return; };

if (activate) {
  start = function(key) {
    now = performance.now();
    if (!logs[key]) {
      logs[key] = {};
      metrics[key] = {
        n: key,
        cost: 0, //relative to baseline
        c: 0,
        t: 0,
        u: 0
      };
    }
    logs[key][now] = -1;
    return now;
  }

  stop = function(key, startNow) {
    delete logs[key][startNow];
    metrics[key].c++;
    metrics[key].t += performance.now() - startNow;
    return;
  }

  function display() {
    const perf = {
      byTime: [],
      byName: [],
      byCount: [],
      byUnfinished: [],
    };

    let metric = null;
    // get baseline metrics first
    _calcMetrics('__baseline');

    perf.stats = {
      totalCost: 0,
      costPerSec: 0,
    };
    Object.keys(metrics).forEach((key) => {
      _calcMetrics(key);

      // compare to __baseline
      metrics[key].cost = metrics[key].t / metrics['__baseline'].t;

      // update all keys to less precision
      metrics[key].t = +metrics[key].t.toFixed(2);
      metrics[key].timeAvg = +metrics[key].timeAvg.toFixed(3);
      metrics[key].cost = +metrics[key].cost.toFixed(2);
      metrics[key].costPerSec = +(metrics[key].cost / (performance.now() / 1000)).toFixed(2);

      // push to all the arrays
      Object.keys(perf).forEach((perfType) => {
        if (Array.isArray(perf[perfType])) {
          perf[perfType].push(metrics[key]);
        }
      });
    });
    perf.stats.totalCost = metrics['main.draw'].cost + metrics['main.update'].cost;
    perf.stats.costPerSec = +(perf.stats.totalCost / (performance.now() / 1000)).toFixed(2);

    perf.byName.sort(function(a, b) {
      return (a.n < b.n) ? -1 : 1;
    });
    perf.byTime.sort(function(a, b) {
      return b.t - a.t;
    });
    perf.byCount.sort(function(a, b) {
      return b.c - a.c;
    });
    perf.byUnfinished.sort(function(a, b) {
      return b.u - a.u;
    });

    // calc total cost / second

    return perf;
  }

  function _calcMetrics(key) {
    metrics[key].u = Object.keys(logs[key]).length;
    metrics[key].timeAvg = metrics[key].t / metrics[key].c;
  }

  // create a baseline scenario to compare others to
  const baselineArray = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0];
  let baseP = null;
  setInterval(() => {
    baseP = start('__baseline');
    baselineArray.forEach((item, i) => {
      baselineArray[i] = Math.random();
    });
    stop('__baseline', baseP);
  }, 100);

  // attach to global object so can be called from console window
  global.displayPerf = display;
}

export default { start, stop };
