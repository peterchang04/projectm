let isFullScreen = null;
let documentElement = null;

function init() {
  isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  documentElement = document.documentElement;
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
  if (documentElement.requestFullscreen) {
    documentElement.requestFullscreen().then(() => { isFullScreen = true });
  } else if (documentElement.mozRequestFullScreen) { /* Firefox */
    documentElement.mozRequestFullScreen().then(() => { isFullScreen = true });
  } else if (documentElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    const promise = documentElement.webkitRequestFullscreen();
    console.log(documentElement.webkitRequestFullscreen);
    if (promise) promise.then(() => { isFullScreen = true });
  } else if (documentElement.msRequestFullscreen) { /* IE/Edge */
    documentElement.msRequestFullscreen().then(() => { isFullScreen = true });
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
