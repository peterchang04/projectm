const date = new Date();

function activate({ el, onStart, onMove, onEnd }) {
  const startHandler = (e) => {
    if (typeof onStart === 'function') onStart(e);
  };
  const moveHandler = (e) => {
    if (typeof onMove === 'function') onMove(e);
  };
  const endHandler = (e) => {
    if (typeof onEnd === 'function') onEnd(e);
  }

  el.ontouchstart = startHandler;
  el.ontouchmove = moveHandler;
  el.ontouchcancel = endHandler;
  el.ontouchend = endHandler;
}

export default { activate };
