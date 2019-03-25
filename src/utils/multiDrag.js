const date = new Date();

// monitor and broadcast a fake "down" event based on the last move event
const touchDowns = {};
setInterval(() => {
  Object.keys(touchDowns).forEach((which) => {
    touchDowns[which].onDown(touchDowns[which].e);
  });
}, 100);

function activate({ el, onStart, onMove, onEnd, onDown }) {
  const startHandler = (e) => {
    if (typeof onStart === 'function') onStart(e);
    if (typeof onDown === 'function') {
      touchDowns[e.which] = { e, onDown };
    }
  };
  const moveHandler = (e) => {
    if (typeof onMove === 'function') onMove(e);
    // update event for down with latest from move
    if (touchDowns[e.which]) touchDowns[e.which].e = e;
  };
  const endHandler = (e) => {
    if (typeof onEnd === 'function') onEnd(e);
    delete touchDowns[e.which];
  }

  el.ontouchstart = startHandler;
  el.ontouchmove = moveHandler;
  el.ontouchcancel = endHandler;
  el.ontouchend = endHandler;
}

export default { activate };
