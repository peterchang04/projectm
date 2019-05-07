let isFullScreen = null;
let docmentElement = null;

function init() {
  isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  docmentElement = document.documentElement;
}

function toggle() {
  if (isFullScreen === null) init();
  if (isFullScreen) {
    exitFullScreen();
  } else {
    enterFullScreen();
  }
}

function enterFullScreen() {
  if (docmentElement.requestFullscreen) {
    docmentElement.requestFullscreen().then(() => { isFullScreen = true });
  } else if (docmentElement.mozRequestFullScreen) { /* Firefox */
    docmentElement.mozRequestFullScreen().then(() => { isFullScreen = true });
  } else if (docmentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    docmentElement.webkitRequestFullscreen().then(() => { isFullScreen = true });
  } else if (docmentElement.msRequestFullscreen) { /* IE/Edge */
    docmentElement.msRequestFullscreen().then(() => { isFullScreen = true });
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen().then(() => { isFullScreen = false });
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen().then(() => { isFullScreen = false });;
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen().then(() => { isFullScreen = false });;
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen().then(() => { isFullScreen = false });;
  }
}

export default { init, toggle };
