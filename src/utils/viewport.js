import state from './state.js';
import eventManager from './eventManager.js'
import stylesheet from './stylesheet.js';

const temp = {};

const viewport = {
   // dimensions of the browser view area
  height: -1,
  width: -1,
   // dimesnions of the game canvas
  gameWidth: -1,
  gameHeight: -1,
  pixelGameWidth: -1,
  pixelGameHeight: -1,
  pixelRatio: window.devicePixelRatio,

  // this is how far forward the ship is on gameView
  shipYPercent: 0.5, // default halfway.. less is further up on screen

  // this is the base scale of the game. How many meters visible in vertical gameview space
  gameHeightMeters: 350,

  pixelsPerMeter: -1,// pixelsPerMeter is the zoom value.
  vwPixels: -1, // useful for

  isLandscape: isLandscape(),
  isPortrait: isPortrait(),
  device: 'phone', // not a true absolute device, but an approximation based on screen orientation & dimensions
  update: update, // hook to allow updating
  shipPixelX: 0,
  shipPixelY: 0
};

function init() {
  initBaseStylesheet();

  eventManager.add(window, 'resize.viewport', () => {
    update();
    // some devices... take longers to re-orientate and update on resize
    setTimeout(() => {
      update();
    }, 150);
  });

  update(); // kick off update
}

function update() {
  viewport.isLandscape = isLandscape();
  viewport.isPortrait = isPortrait();
  getDimensions(); // determine height / width of viewport
  viewport.device = getViewportDevice(); // phone - tablet - pc
  viewport.layoutString = getLayoutString(); // get layout string (pc-landscape vs phone-portrait)
  setViewLayout(viewport.layoutString);

  viewport.pixelGameWidth = viewport.gameWidth * window.devicePixelRatio;
  viewport.pixelGameHeight = viewport.gameHeight * window.devicePixelRatio;
  viewport.vwPixels = viewport.pixelGameWidth / 100;

  // solve for ship position on screen
  viewport.shipPixelX = viewport.pixelGameWidth / 2;
  viewport.shipPixelY = viewport.pixelGameHeight * viewport.shipYPercent; // a little more forward visibility

  /*
    IMPORTANT pixelsPerMeter IS FOR ACTOR SCALE ON SCREEN
    we want to show ship scale commensurate with having 8 ships worth of forward visibility initially.
    half as much (4 ships) behind
    ship is 20 meters so 160 meters forward, 80 behind for a total screen height of 240m
  */

  viewport.pixelsPerMeter = viewport.pixelGameHeight / viewport.gameHeightMeters;

  // push to vue
  if (viewport.layoutString != state.get('layoutString')) state.set('layoutString', viewport.layoutString);

  // issue event for update
  window.dispatchEvent(new CustomEvent('viewportUpdated', {
    detail: {
      layoutString: viewport.layoutString,
      gameLeft: viewport.gameLeft,
      gameWidth: viewport.gameWidth,
      gameHeight: viewport.gameHeight,
    }
  }));
}

function isPortrait() {
  // if (window.orientation !== undefined) { // for IOS - NOTE: DO NOT USE THIS. Orientation 0 means different things to different devices.
  //   return (window.orientation === 0);
  // }
  // return window.innerWidth < window.innerHeight; This approach has timing issues on iOS mini 4
  return document.documentElement.clientWidth < document.documentElement.clientHeight;
}

function isLandscape() {
  return !isPortrait();
}

function getDimensions() {
  if (viewport.isLandscape) {
    viewport.width = (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight;
    viewport.height = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
    // ios incorrectly reports physical phone width as width even in landscape (ugh). At least we know the orientation
    if (navigator.userAgent.includes('iPhone;') && !navigator.userAgent.includes('OS 11_0' /* chrome devtools */)) viewport.height = screen.width;
  } else {
    viewport.width = (window.innerWidth > window.innerHeight) ? window.innerHeight: window.innerWidth;
    viewport.height = (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight;
  }
}

function getLayoutString() {
  return `${viewport.device}-${(viewport.isPortrait) ? 'portrait' : 'landscape'}`;
}

function setViewLayout(layoutString) { // do various calculations required for screen layout
  // state.set('test', `H${screen.height}_${screen.availHeight}_${window.innerHeight}_${document.documentElement.clientHeight}`);
  // state.set('test2', `W${screen.width}_${screen.availWidth}_${window.innerWidth}_${document.documentElement.clientWidth}`);
  // state.set('test2', navigator.userAgent);
  switch (layoutString) {
    case 'phone-portrait':
      if (state.get('currentRole') === null) {
        viewport.gameLeft = 0;
        viewport.gameWidth = viewport.width;
        viewport.gameHeight = viewport.height - (viewport.width * .125); // minus rolebar, which is bottom
        viewport.shipYPercent = 0.55;
        viewport.gameHeightMeters = 350;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            left: 0,
            width: '100%',
            'font-size': '3.2vw',
          },
          '#roleBar .role': {
            width: '25%',
            'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      } else {
        // this is the default layout
        viewport.gameLeft = 0;
        viewport.gameWidth = viewport.width;
        viewport.gameHeight = viewport.height - (viewport.width * (.74 + .125)); // 74vw panels, 12.5vw roleBar
        viewport.shipYPercent = 0.7;
        viewport.gameHeightMeters = 220;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: '74vw',
            left: 0,
            width: '100%',
            'font-size': '3.2vw',
          },
          '#roleBar .role': {
            width: '25%',
            'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      }

      stylesheet.apply('gameview-byviewport', {
        '#gameView': {
          left: 0,
          height: `${viewport.gameHeight}px`,
          width: '100%',
        }
      });

      stylesheet.apply('targetsbar-byviewport', {
        // across the screen
        '#targetsBar': { width: '100%' },
        '#targetsBar .content': {
          width: '50%',
          'font-size': '5vw',
        },
        // no targets
        '#targetsBar .content .target': {
          'border-width': '0.5vw',
          'border-right-width': 0,
          'border-top-width': 0,
          'outline-offset': '-0.7vw',
          'outline-width': '0.7vw',
        },
        '#targetsBar .content:first-child .target:first-child': { 'border-left-width': 0 },
        // first targeted
        '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.5vw' },
        '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },
        // second targeted
        '#targetsBar .content:first-child .target.hasTarget:last-child': { 'border-right-width': '0.5vw' },
        '#targetsBar .content:last-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },
        // third targeted
        '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.5vw' },
        '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
        // last targeted doesn't need changes
      });
      break;
    case 'phone-landscape':
      temp.panelWidth = viewport.height * .66; // 66vh wide panels
      // full screen view
      if (state.get('currentRole') === null) {
        viewport.gameLeft = 0;
        viewport.gameWidth = viewport.width;
        viewport.gameHeight = viewport.height;
        viewport.shipYPercent = 0.57;
        viewport.gameHeightMeters = 230;

        // gameview - whole screen
        stylesheet.apply('gameview-byviewport', {
          '#gameView': {
            left: 0,
            height: `100%`,
            width: '100%',
          }
        });

        // targetsbar split view
        stylesheet.apply('targetsbar-byviewport', {
          // across the screen
          '#targetsBar': { width: '100%' },
          '#targetsBar .content': {
            width: '33%',
            'font-size': '3.3vw',
          },
          // no targets
          '#targetsBar .content .target': {
            'border-width': '0.33vw',
            'border-top-width': 0,
            'outline-offset': '-0.5vw',
            'outline-width': '0.5vw',
          },
          '#targetsBar .content:first-child .target:first-child': {
            'border-right-width': 0,
            'border-left-width': 0,
          },
          '#targetsBar .content:last-child .target': { 'border-right-width': 0 }, // because second content block is reversed

          // first targeted
          '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.33vw' },
          '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },

          // third targeted
          '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.33vw' },
          '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
        });

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            width: '90vh',
            left: '50%',
            'margin-left': '-45vh',
            'font-size': '2.8vh',
          },
          '#roleBar .role': {
            width: '25%',
            'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      } else {
        viewport.gameLeft = temp.panelWidth;
        viewport.gameWidth = viewport.width - temp.panelWidth - temp.panelWidth;
        viewport.gameHeight = viewport.height;
        viewport.shipYPercent = 0.53;
        viewport.gameHeightMeters = 230;

        // gameview - minus full height panels
        stylesheet.apply('gameview-byviewport', {
          '#gameView': {
            left: `${viewport.gameLeft}px`,
            height: `100%`,
            width: `${viewport.gameWidth}px`,
          }
        });

        // targetsBar
        if (viewport.gameWidth > (viewport.gameHeight * 0.7)) {
          // targetsbar 4 across row view - squeezed between 2 panels
          stylesheet.apply('targetsbar-byviewport', {
            '#targetsBar': {
              left: `${viewport.gameLeft}px`,
              width: `${viewport.gameWidth}px`,
            },
            '#targetsBar .content': {
              width: '50%',
              'font-size': `${viewport.gameWidth / 19.5}px`,
            },
            // no targets
            '#targetsBar .content .target': {
              'border-width': '0.25vw', // this probably a bigger screened phone, so .25vw instead of .33
              'border-right-width': 0,
              'border-top-width': 0,
              'outline-offset': '-0.33vw',
              'outline-width': '0.33vw',
            },
            '#targetsBar .content:first-child .target:first-child': { 'border-left-width': 0 }, // because second content block is reversed
            // first targeted
            '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.25vw' },
            '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },
            // second targeted
            '#targetsBar .content:first-child .target.hasTarget:last-child': { 'border-right-width': '0.25vw' },
            '#targetsBar .content:last-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },
            // third targeted
            '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.25vw' },
            '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
            // last targeted doesn't need changes
          });

          stylesheet.apply('rolebar-byviewport', {
            '#roleBar': {
              bottom: 0,
              width: `${viewport.gameWidth}px`,
              left: `${viewport.gameLeft}px`,
              'font-size': `${viewport.gameWidth / 32}px`,
            },
            '#roleBar .role': {
              width: '25%',
              'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
            }
          });
        } else {
          /* not enough space, stack targets in a grid STACK
            given targets [0, 1, 2, 3] will be displayed as:
            0 3  (3 appears before 2 because ordering rtl (right to left))
            1 2
            targets get filled in this order 0, 3, 1, 2 - to maintain optimal forward visibility
          */
          stylesheet.apply('targetsbar-byviewport', {
            '#targetsBar': {
              left: `${viewport.gameLeft}px`,
              width: `${viewport.gameWidth}px`,
            },
            '#targetsBar .content': {
              width: '50%',
              'font-size': `${viewport.gameWidth / 10.7}px`,
              position: 'relative', // instead of absolute. this will force 'stacking' behavior
            },
            '#targetsBar .content .target': {
              width: '100%', // was 50% - this makes it overflow & stack
              'padding-top': '64%', // default was 32% - maintains aspect ratio
              'border-width': '0.25vw',
              'border-right-width': 0,
              'border-top-width': 0,
              'outline-offset': '-0.33vw',
              'outline-width': '0.33vw',
            },
            // no targets selected
            '#targetsBar .content:first-child .target': {
              'border-left-width': 0,
            },
            // first selected
            '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.25vw' },
            '#targetsBar .content:last-child .target.hasTarget0:first-child': { 'border-left-width': 0 },
            // third selected
            '#targetsBar .content:first-child .target.hasTarget:last-child': {
              'border-right-width': '0.25vw',
              'border-top-width': '0.25vw',
            },
            '#targetsBar .content:last-child .target.hasTarget1:last-child': { 'border-left-width': 0 },
            '#targetsBar .content:first-child .target.hasTarget1:first-child': { 'border-bottom-width': 0 },
            // forth selected
            '#targetsBar .content:last-child .target.hasTarget:last-child': {
              'border-top-width': '0.25vw',
            },
            '#targetsBar .content:last-child .target.hasTarget2:first-child': { 'border-bottom-width': 0 },
          });

          // stacked, like targetsBar
          stylesheet.apply('rolebar-byviewport', {
            '#roleBar': {
              bottom: 0,
              width: `${viewport.gameWidth}px`,
              left: `${viewport.gameLeft}px`,
              'font-size': `${viewport.gameWidth / 16}px`,
            },
            '#roleBar .role': {
              width: '50%',
              'padding-top': '25%', // relative height hack - instead of 100% use half of width as padding
            }
          });
        }
      }
      break;
    case 'tablet-portrait':
      viewport.gameLeft = 0;
      viewport.gameWidth = viewport.width;
      viewport.gameHeight = viewport.height;
      if (state.get('currentRole') === null) {
        viewport.shipYPercent = 0.57;
        viewport.gameHeightMeters = 350;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            width: `50%`,
            left: `50%`,
            'margin-left': '-25%',
            'font-size': `1.6vw`,
          },
          '#roleBar .role': {
            width: '25%',
            'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      } else {
        viewport.shipYPercent = 0.4;
        viewport.gameHeightMeters = 420;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            width: `34vw`,
            left: `33vw`,
            'font-size': `2.15vw`,
          },
          '#roleBar .role': {
            width: '50%',
            'padding-top': '25%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      }

      // gameview - minus full height panels
      stylesheet.apply('gameview-byviewport', {
        '#gameView': {
          left: 0,
          height: `100%`,
          width: `100%`,
        }
      });

      // targetsbar split view
      stylesheet.apply('targetsbar-byviewport', {
        // across the screen
        '#targetsBar': { width: '100%' },
        '#targetsBar .content': {
          width: '33%',
          'font-size': '3.3vw',
        },
        // no targets
        '#targetsBar .content .target': {
          'border-width': '0.28vw',
          'border-top-width': 0,
          'outline-offset': '-0.4vw',
          'outline-width': '0.4vw',
        },
        '#targetsBar .content:first-child .target:first-child': {
          'border-right-width': 0,
          'border-left-width': 0,
        },
        '#targetsBar .content:last-child .target': { 'border-right-width': 0 }, // because second content block is reversed

        // first targeted
        '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.28vw' },
        '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },

        // third targeted
        '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.28vw' },
        '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
      });
      break;
    case 'tablet-landscape':
      viewport.gameLeft = 0;
      viewport.gameWidth = viewport.width;
      viewport.gameHeight = viewport.height;
      viewport.shipYPercent = 0.57;
      viewport.gameHeightMeters = 300;

      // gameview - minus full height panels
      stylesheet.apply('gameview-byviewport', {
        '#gameView': {
          left: 0,
          height: `100%`,
          width: `100%`,
        }
      });

      // targetsbar split view
      stylesheet.apply('targetsbar-byviewport', {
        // across the screen
        '#targetsBar': { width: '100%' },
        '#targetsBar .content': {
          width: '33vh',
          'font-size': '3.3vh',
        },
        // no targets
        '#targetsBar .content .target': {
          'border-width': '0.28vh',
          'border-top-width': 0,
          'outline-offset': '-0.4vh',
          'outline-width': '0.4vh',
        },
        '#targetsBar .content:first-child .target:first-child': {
          'border-right-width': 0,
          'border-left-width': 0,
        },
        '#targetsBar .content:last-child .target': { 'border-right-width': 0 }, // because second content block is reversed

        // first targeted
        '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.28vh' },
        '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },

        // third targeted
        '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.28vh' },
        '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
      });

      stylesheet.apply('rolebar-byviewport', {
        '#roleBar': {
          bottom: 0,
          width: `50vh`,
          left: `50%`,
          'margin-left': '-25vh',
          'font-size': `1.6vh`,
        },
        '#roleBar .role': {
          width: '25%',
          'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
        }
      });
      break;
    case 'pc-portrait':
      viewport.gameLeft = 0;
      viewport.gameWidth = viewport.width;
      viewport.gameHeight = viewport.height;
      if (state.get('currentRole') === null) {
        viewport.shipYPercent = 0.57;
        viewport.gameHeightMeters = 420;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            width: `50%`,
            left: `50%`,
            'margin-left': '-25%',
            'font-size': `1.6vw`,
          },
          '#roleBar .role': {
            width: '25%',
            'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      } else {
        viewport.shipYPercent = 0.4;
        viewport.gameHeightMeters = 450;

        stylesheet.apply('rolebar-byviewport', {
          '#roleBar': {
            bottom: 0,
            width: `34vw`,
            left: `33vw`,
            'font-size': `2.15vw`,
          },
          '#roleBar .role': {
            width: '50%',
            'padding-top': '25%', // relative height hack - instead of 100% use half of width as padding
          }
        });
      }

      // gameview - minus full height panels
      stylesheet.apply('gameview-byviewport', {
        '#gameView': {
          left: 0,
          height: `100%`,
          width: `100%`,
        }
      });

      // targetsbar split view
      stylesheet.apply('targetsbar-byviewport', {
        // across the screen
        '#targetsBar': { width: '100%' },
        '#targetsBar .content': {
          width: '33%',
          'font-size': '3.3vw',
        },
        // no targets
        '#targetsBar .content .target': {
          'border-width': '0.2vw',
          'border-top-width': 0,
          'outline-offset': '-0.3vw',
          'outline-width': '0.3vw',
        },
        '#targetsBar .content:first-child .target:first-child': {
          'border-right-width': 0,
          'border-left-width': 0,
        },
        '#targetsBar .content:last-child .target': { 'border-right-width': 0 }, // because second content block is reversed

        // first targeted
        '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.2vw' },
        '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },

        // third targeted
        '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.2vw' },
        '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
      });
      break;
    case 'pc-landscape':
      viewport.gameLeft = 0;
      viewport.gameWidth = viewport.width;
      viewport.gameHeight = viewport.height;
      viewport.shipYPercent = 0.57;
      viewport.gameHeightMeters = 400;

      // gameview - minus full height panels
      stylesheet.apply('gameview-byviewport', {
        '#gameView': {
          left: 0,
          height: `100%`,
          width: `100%`,
        }
      });

      // targetsbar split view
      stylesheet.apply('targetsbar-byviewport', {
        // across the screen
        '#targetsBar': { width: '100%' },
        '#targetsBar .content': {
          width: '33vh',
          'font-size': '3.3vh',
        },
        // no targets
        '#targetsBar .content .target': {
          'border-width': '0.2vh',
          'border-top-width': 0,
          'outline-offset': '-0.3vh',
          'outline-width': '0.3vh',
        },
        '#targetsBar .content:first-child .target:first-child': {
          'border-right-width': 0,
          'border-left-width': 0,
        },
        '#targetsBar .content:last-child .target': { 'border-right-width': 0 }, // because second content block is reversed

        // first targeted
        '#targetsBar .content:first-child .target.hasTarget:first-child': { 'border-right-width': '0.2vh' },
        '#targetsBar .content:first-child .target.lastHasTarget:last-child': { 'border-left-width': 0 },

        // third targeted
        '#targetsBar .content:last-child .target.hasTarget:last-child': { 'border-right-width': '0.2vh' },
        '#targetsBar .content:last-child .target.lastHasTarget:first-child': { 'border-left-width': 0 },
      });

      stylesheet.apply('rolebar-byviewport', {
        '#roleBar': {
          bottom: 0,
          width: `50vh`,
          left: `50%`,
          'margin-left': '-25vh',
          'font-size': `1.6vh`,
        },
        '#roleBar .role': {
          width: '25%',
          'padding-top': '12.5%', // relative height hack - instead of 100% use half of width as padding
        }
      });
  }
}

function getViewportDevice() {
  if (viewport.isPortrait) {
    viewport.device = 'phone';
    if (viewport.width > 599) viewport.device = 'tablet';
    if (viewport.width > 1024) viewport.device = 'pc';
  } else if (viewport.isLandscape) {
    viewport.device = 'phone';
    if (viewport.width > 900) viewport.device = 'tablet';
    if (viewport.width > 1366) viewport.device = 'pc';
  }
  return viewport.device;
}

function initBaseStylesheet() {
  // phone portrait
  stylesheet.apply('phone-portrait_BASE', {
    '.phone-portrait .leftPanel, .phone-portrait .rightPanel': {
      width: '50%',
      height: '74vw',
      'font-size': '3.3vw',
    },
    '.phone-portrait .leftPanel': { padding: '1vw 0.5vw 1vw 0vw' },
    '.phone-portrait .rightPanel': { padding: '1vw 0vw 1vw 0.5vw' }
  });

  stylesheet.apply('phone-landscape_BASE', {
    '.phone-landscape .leftPanel, .phone-landscape .rightPanel': {
      width: '66vh',
      height: '100%',
      'font-size': '4.4vh',
    },
    '.phone-landscape .leftPanel': { padding: '1vw 0.5vw 1vw 0' },
    '.phone-landscape .rightPanel': { padding: '1vw 0 1vw 0.5vw' }
  });

  stylesheet.apply('tablet-portrait_BASE', {
    '.tablet-portrait .leftPanel, .tablet-portrait .rightPanel': {
      width: '33vw',
      height: '49vw',
      'font-size': '2.2vw',
    },
    '.tablet-portrait .leftPanel': { padding: '0 0.5vw 1vw 0' },
    '.tablet-portrait .rightPanel': { padding: '0 0 1vw 0.5vw' }
  });

  stylesheet.apply('tablet-landscape_BASE', {
    '.tablet-landscape .leftPanel, .tablet-landscape .rightPanel': {
      width: '33vh',
      height: '49vh',
      'font-size': '2.2vh',
    },
    '.tablet-landscape .leftPanel': { padding: '0 0.5vh 1vh 0' },
    '.tablet-landscape .rightPanel': { padding: '0 0 1vh 0.5vh' }
  });

  stylesheet.apply('pc-portrait_BASE', {
    '.pc-portrait .leftPanel, .pc-portrait .rightPanel': {
      width: '33vw',
      height: '49vw',
      'font-size': '2.2vw',
    },
    '.pc-portrait .leftPanel': { padding: '0 0.5vw 1vw 0' },
    '.pc-portrait .rightPanel': { padding: '0 0 1vw 0.5vw' }
  });

  stylesheet.apply('pc-landscape_BASE', {
    '.pc-landscape .leftPanel, .pc-landscape .rightPanel': {
      width: '33vh',
      height: '49vh',
      'font-size': '2.2vh',
      'padding-bottom': '0.5vh',
    }
  });
}

// traditional whole file export
export default { useDeconstructedImport: true };
export function getViewport() {
  return viewport;
};
export const initViewport = init;
