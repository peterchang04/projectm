import state from './state.js';
const date = new Date();
const test = [];
let multiDragId = 1; // don't start at zero. there's an eval and zero == false
const temp = {};

const elements = {}; // tracks which elements are registered to which fingers

// monitor and broadcast a fake "down" event based on the last move event
const broadcastTouchDowns = {}; // tracks how many finger (mousedowns) are down
global.hasDocumentListeners = false;

// BROADCAST event repeated when held down
setInterval(() => {
  Object.keys(broadcastTouchDowns).forEach((which) => {
    /*
      for when finger is down but not moving, continue to fire down events
      this is used for steering, to keep the drag circle under finger.
      Otherwise it would start to correct to 0 degrees as ship turns.
    */
    if (broadcastTouchDowns[which].onDown && typeof broadcastTouchDowns[which].onDown === 'function') {
      // check that the event is valid
      broadcastTouchDowns[which].onDown(broadcastTouchDowns[which].e);
    }
  });
}, 100);

function activate({ el, onStart, onMove, onEnd, onDown }) {
  // attach a multiDragId to el
  el.multiDragId = multiDragId++;
  el.onStart = onStart;
  el.onMove = onMove;
  el.onEnd = onEnd;
  elements[el.multiDragId] = el;

  elements[el.multiDragId] = {
    el,
    onStart,
    onMove,
    onEnd,
    touchIdentifiers: {}
  };

  const startHandler = (e) => {
    // setup the package per touchList
    for (temp.i = 0; temp.i < e.targetTouches.length; temp.i++) {
      // find associated element by multiDragId
      temp.multiDragId = e.targetTouches[temp.i].target.multiDragId;
      if (temp.multiDragId) {
        // record which touch has begun on which element
        elements[temp.multiDragId].touchIdentifiers[e.targetTouches[temp.i].identifier] = true;
        // send information to element trigger
        if (elements[temp.multiDragId].onStart) elements[temp.multiDragId].onStart(
          e.targetTouches[temp.i].clientX,
          e.targetTouches[temp.i].clientY,
          e.targetTouches[temp.i]
        );
        // register with broadcastTouchDowns
        broadcastTouchDowns[e.targetTouches[temp.i].identifier] = {};
        broadcastTouchDowns[e.targetTouches[temp.i].identifier].e = e;
        broadcastTouchDowns[e.targetTouches[temp.i].identifier].onDown = onDown;
      }
    }
  };

  const endHandler = (e) => {
    for (temp.i = 0; temp.i < e.changedTouches.length; temp.i++) {
      // see if this end touch was live in some element
      Object.keys(elements).map((multiDragId) => {
        if (elements[multiDragId].touchIdentifiers[e.changedTouches[temp.i].identifier]) {
          // remove this touch from element
          delete elements[multiDragId].touchIdentifiers[e.changedTouches[temp.i].identifier];
          // remove from broadcast
          delete broadcastTouchDowns[e.changedTouches[temp.i].identifier];
          // trigger function
          elements[multiDragId].onEnd(
            e.changedTouches[temp.i].clientX,
            e.changedTouches[temp.i].clientY,
            e.changedTouches[temp.i]
          );
        }
      });
    }
  }

  const moveHandler = (e) => {
    for (temp.i = 0; temp.i < e.changedTouches.length; temp.i++) {
      // see if this touch was live in some element
      Object.keys(elements).map((multiDragId) => {
        if (elements[multiDragId].touchIdentifiers[e.changedTouches[temp.i].identifier]) {
          // trigger function
          elements[multiDragId].onMove(
            e.changedTouches[temp.i].clientX,
            e.changedTouches[temp.i].clientY,
            e.changedTouches[temp.i]
          );
          // renew the event with latest for broadcast
          broadcastTouchDowns[e.changedTouches[temp.i].identifier].e = e;
        }
      });
    }
  };

  el.ontouchstart = startHandler;
  el.ontouchmove = moveHandler;
  el.ontouchcancel = endHandler;
  el.ontouchend = endHandler;

  // for mouse instead of touch
  el.onmousedown = (e) => {
    // translate the event so it behaves like a touchdown
    e.targetTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];
    e.changedTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];
    startHandler(e);
  };

  // GLOBAL LISTENERS DON'T DOUBLE ADD
  if (global.hasDocumentListeners) return;
  // listen for mousemove even if mouse is no longer within el
  document.addEventListener('mousemove', (e) => {
    if (Object.keys(broadcastTouchDowns).length === 0) return;
    if (broadcastTouchDowns[e.which]) {
      e.targetTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];
      e.changedTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];

      moveHandler(e);
      // update with latest from move, for onDown
      if (broadcastTouchDowns[e.which]) broadcastTouchDowns[e.which].e = e;
    }
  });
  // listen for mouseup even if mouse is no longer within el
  document.addEventListener('mouseup', (e) => {
    if (Object.keys(broadcastTouchDowns).length === 0) return;
    e.targetTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];
    e.changedTouches = [{ identifier: e.which, target: e.target, clientX: e.clientX, clientY: e.clientY }];
    endHandler(e);
    delete broadcastTouchDowns[e.which];
  });
  global.hasDocumentListeners = true;
}

export default { activate };
