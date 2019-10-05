import NoSleep from 'nosleep.js';
import eventManager from './eventManager.js';

function init() {
  // initialize noSleep
  const noSleep = new NoSleep();
  if ('ontouchstart' in document.documentElement) {
    eventManager.add(window, 'touchstart.noSleep', function() {
      noSleep.enable();
      eventManager.remove(window, 'touchstart.noSleep');
    });
  } else {
    eventManager.add(window, 'click.noSleep', function() {
      noSleep.enable();
      eventManager.remove(window, 'click.noSleep');
    });
  }
}

export default { init };
