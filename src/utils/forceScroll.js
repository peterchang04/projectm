import eventManager from './eventManager.js';
let currentScrollTo = 1;

// for some mobile browsers, the address and bottom will hide when scroll is not at top
function init() {
  // check for scroll div
  const existingScrollDiv = document.getElementById('forceScroll');
  if (existingScrollDiv) return; // already initted

  const scrollDiv = document.createElement('div');
  scrollDiv.id = 'forceScroll';
  scrollDiv.style= 'height:5000px;width:100%;display:inline-block;background-color:rgba(0,0,0,.7)';
  document.body.appendChild(scrollDiv);
  window.scrollTo(0, 0);

  eventManager.add(window, 'scroll.forceScrollUserScroll', (e) => {
    // bring #app back to top layer, hiding #forceScroll
    const app = document.getElementById('app');
    app.style = 'z-index:1';
    currentScrollTo++;
    window.scrollTo(0, currentScrollTo);
  });

  eventManager.add(window, 'touchmove.forceScrollUserScroll', (e) => {
    // bring #app back to top layer, hiding #forceScroll
    const app = document.getElementById('app');
    app.style = 'z-index:1';
    currentScrollTo++;
    window.scrollTo(0, currentScrollTo);
  });

  eventManager.add(window, 'gesturechange.forceScrollUserScroll', (e) => {
    // bring #app back to top layer, hiding #forceScroll
    const app = document.getElementById('app');
    app.style = 'z-index:1';
    currentScrollTo++;
    window.scrollTo(0, currentScrollTo);
  });
}

export default { init };
