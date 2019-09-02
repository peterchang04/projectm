import $g from '../../utils/globals.js';
import maths from '../../utils/maths.js';
import perf from '../../utils/perf.js';

const temp = {
  sectors: [
    [0, 0], // top-right
    [-1, 0], // top-left
    [0,-1], // bottom-right
    [-1, -1] // bottom-left
  ],
};
let canvas = null;
let context = null;
let stars = [];

function prepopulateStars() {
  temp.stars = [];
  // handful of closer looking foreground specks
  for (temp.i = 0; temp.i < 7; temp.i++) {
    temp.stars.push({
      x: maths.random(0, 99),
      y: maths.random(0, 99),
      w: (maths.random(0, 99) / 100 * $g.viewport.pixelsPerMeter),
      c: `rgba(255,255,255,${maths.random(60, 80) / 100})`,
      scale: maths.random(300,450) / 100, // 3-4.5 in scale
    });
  }
  // mediums distance stars
  for (temp.i = 0; temp.i < 20; temp.i++) {
    temp.stars.push({
      x: maths.random(0, 99),
      y: maths.random(0, 99),
      w: (maths.random(0, 99) / 100 * $g.viewport.pixelsPerMeter),
      c: `rgba(255,255,255,${maths.random(70, 90) / 100})`,
      scale: maths.random(30,70) / 100, // .3-.7 in scale
    });
  }
  // long distance stars, barely moving
  for (temp.i = 0; temp.i < 15; temp.i++) {
    temp.stars.push({
      x: maths.random(0, 99),
      y: maths.random(0, 99),
      w: (maths.random(0, 99) / 100 * $g.viewport.pixelsPerMeter),
      c: `rgba(255,255,255,${maths.random(40, 90) / 100})`,
      scale: maths.random(0,20) / 100, // 0.0-0.2 in scale
    });
  }
  return temp.stars;
}

// pregenerate particles enough to populate a screen's worth.


function init() { perf.start('starCanvas.init');
  // setup draw canvas
  canvas = document.getElementById('canvas_stars');
  context = canvas.getContext('2d');
  canvas.width = $g.viewport.pixelWidth;
  canvas.height = $g.viewport.pixelHeight;

  stars = prepopulateStars();
  perf.stop('starCanvas.init');
}

function getSectors(sectorLength) {
  // current sector
  temp.sectorX = Math.round($g.game.myShip.mX / sectorLength);
  temp.sectorY = Math.round($g.game.myShip.mY / sectorLength);

  temp.sectors[0][0] = temp.sectorX;
  temp.sectors[0][1] = temp.sectorY;
  temp.sectors[1][0] = temp.sectorX - 1;
  temp.sectors[1][1] = temp.sectorY;
  temp.sectors[2][0] = temp.sectorX;
  temp.sectors[2][1] = temp.sectorY - 1;
  temp.sectors[3][0] = temp.sectorX - 1;
  temp.sectors[3][1] = temp.sectorY - 1;
  return temp.sectors;
}

function draw() { perf.start('starCanvas.draw');
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawStarsProjectedBySector(stars);
  perf.stop('starCanvas.draw');
}

function drawStarsProjectedBySector(stars) { perf.start('starCanvas.drawStarsProjectedBySector');
  // sector upper right
  stars.map((star) => {
    temp.sectorLength = $g.viewport.pixelWidth / 2 / star.scale;
    temp.sectors = getSectors(temp.sectorLength);
    temp.sectors.map((sector) => {
      // scale the star (defined as 0-99) to sectorLength
      star.scaleX = star.x * (temp.sectorLength / 100);
      star.scaleY = star.y * (temp.sectorLength / 100);
      // rotate depending on which sector
      if (sector[0] % 2 === 0) {
        if (sector[1] % 2 === 0) {
          temp.pivotBySectorX = (temp.sectorLength - star.scaleX) + (temp.sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleY + (temp.sectorLength * sector[1]);
        } else {
          temp.pivotBySectorX = star.scaleY + (temp.sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleX + (temp.sectorLength * sector[1]);
        }
      } else {
        if (sector[1] % 2 === 0) {
          temp.pivotBySectorX = (temp.sectorLength - star.scaleY) + (temp.sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleX + (temp.sectorLength * sector[1]);
        } else {
          temp.pivotBySectorX = star.scaleX + (temp.sectorLength * sector[0]);
          temp.pivotBySectorY = (temp.sectorLength - star.scaleY) + (temp.sectorLength * sector[1]);
        }
      }
      // get pixel to draw
      temp.viewportPixel = $g.game.myShip.getViewportPixel(temp.pivotBySectorX, temp.pivotBySectorY);
      temp.viewportPixel.scaleX = (temp.viewportPixel.x * star.scale) + $g.viewport.shipPixelX - (star.scale * $g.viewport.shipPixelX);
      temp.viewportPixel.scaleY = (temp.viewportPixel.y * star.scale) + $g.viewport.shipPixelY - (star.scale * $g.viewport.shipPixelY);

      if (temp.viewportPixel.scaleX > $g.viewport.pixelWidth || temp.viewportPixel.scaleX < 0) return;
      if (temp.viewportPixel.scaleY > $g.viewport.pixelHeight || temp.viewportPixel.scaleY < 0) return;

      context.fillStyle = star.c;
      context.fillRect(
        temp.viewportPixel.scaleX,
        temp.viewportPixel.scaleY,
        star.w * 2,
        star.w * 2,
      );
    });
  });
  perf.stop('starCanvas.drawStarsProjectedBySector');
}

export default { init, draw };
