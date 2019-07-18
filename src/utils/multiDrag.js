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
    /* mouse support */
    if (e.type === 'mousedown') {
      touchDowns[e.which] = { e, onDown };
    }
    /* end mouse support */

    if (typeof onStart === 'function') onStart(e);
    if (typeof onDown === 'function') {
      touchDowns[e.which] = { e, onDown };
    }
  };
  const moveHandler = (e) => {
    /* mouse support */
    if (!e.touches) {
      // exit early if no touchdowns
      if (Object.keys(touchDowns).length === 0) return;
      e.touches = [{ clientX: e.clientX, clientY: e.clientY }];
    }
    /* end mouse support */

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
  // for mouse instead
  el.onmousedown = startHandler;
  // listen for mousemove even if mouse is no longer within el
  document.addEventListener('mousemove', function(e) {
    if (touchDowns[e.which]) {
      moveHandler(e);
    }
  });
  // listen for mouseup even if mouse is no longer within el
  document.addEventListener('mouseup', function(e) {
    if (touchDowns[e.which]) {
      endHandler(e);
    }
  });
}

export default { activate };
