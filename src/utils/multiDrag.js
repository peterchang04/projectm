const date = new Date();

// monitor and broadcast a fake "down" event based on the last move event
const touchDowns = {}; // tracks how many finger (mousedowns) are down
let hasDocumentListeners = false;

setInterval(() => {
  Object.keys(touchDowns).forEach((which) => {
    /*
      for when finger is down but not moving, continue to fire down events
      this is used for steering, to keep the drag circle under finger.
      Otherwise it would start to correct to 0 degrees as ship turns.
    */
    if (touchDowns[which].onDown && typeof touchDowns[which].onDown === 'function') {
      touchDowns[which].onDown(touchDowns[which].e);
    }
  });
}, 100);

function activate({ el, onStart, onMove, onEnd, onDown }) {
  const startHandler = (e) => {
    if (typeof onStart === 'function') onStart(e);
    touchDowns[e.which] = { e, onDown, onMove, onEnd }; // onX references for document eventlisteners
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

  // for mouse instead
  el.onmousedown = (e) => {
    if (!e.touches) {
      // exit early if no touchdowns
      e.touches = [{ clientX: e.clientX, clientY: e.clientY }];
    }
    startHandler(e);
  };

  // GLOBAL LISTENERS DON'T DOUBLE ADD
  if (hasDocumentListeners) return;
  // listen for mousemove even if mouse is no longer within el
  document.addEventListener('mousemove', (e) => {
    if (Object.keys(touchDowns).length === 0) return;
    if (touchDowns[e.which]) {
      e.touches = [{ clientX: e.clientX, clientY: e.clientY }];
      // update with latest from move, for onDown
      if (touchDowns[e.which]) touchDowns[e.which].e = e;
      if (typeof touchDowns[e.which].onMove === 'function') touchDowns[e.which].onMove(e);
    }
  });
  // listen for mouseup even if mouse is no longer within el
  document.addEventListener('mouseup', (e) => {
    if (Object.keys(touchDowns).length === 0) return;
    if (typeof touchDowns[e.which].onEnd === 'function') touchDowns[e.which].onEnd(e);
    delete touchDowns[e.which];
  });
  hasDocumentListeners = true;
}

export default { activate };
