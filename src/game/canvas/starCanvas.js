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
let stars2 = [];
let stars3 = [];

function populateStars(count) {
  temp.stars = [];
  for (temp.i = 0; temp.i < count; temp.i++) {
    temp.stars.push({ x: maths.random(0, 99), y: maths.random(0, 99), w: (maths.random(0, 99) / 100 * $g.viewport.pixelsPerMeter) });
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

  stars = populateStars(20);
  stars2 = populateStars(15);
  stars3 = populateStars(7);
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
  drawStarsProjectedBySector(stars, 0.7, '#ffffffff');
  drawStarsProjectedBySector(stars2, 0.2, '#ffffffCC');
  drawStarsProjectedBySector(stars3, 4, '#ffffff99');
  perf.stop('starCanvas.draw');
}

function drawStarsProjectedBySector(stars, scale = 1, color = '#ffffffff') { perf.start('starCanvas.drawStarsProjectedBySector');
  const sectorLength = $g.viewport.pixelWidth / 2 / scale;
  temp.sectors = getSectors(sectorLength);
  // sector upper right
  temp.sectors.map((sector) => {
    stars.map((star) => {
      // scale the star (defined as 0-99) to sectorLength
      star.scaleX = star.x * (sectorLength / 100);
      star.scaleY = star.y * (sectorLength / 100);
      // rotate depending on which sector
      if (sector[0] % 2 === 0) {
        if (sector[1] % 2 === 0) {
          temp.pivotBySectorX = (sectorLength - star.scaleX) + (sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleY + (sectorLength * sector[1]);
        } else {
          temp.pivotBySectorX = star.scaleY + (sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleX + (sectorLength * sector[1]);
        }
      } else {
        if (sector[1] % 2 === 0) {
          temp.pivotBySectorX = (sectorLength - star.scaleY) + (sectorLength * sector[0]);
          temp.pivotBySectorY = star.scaleX + (sectorLength * sector[1]);
        } else {
          temp.pivotBySectorX = star.scaleX + (sectorLength * sector[0]);
          temp.pivotBySectorY = (sectorLength - star.scaleY) + (sectorLength * sector[1]);
        }
      }
      // get pixel to draw
      temp.viewportPixel = $g.game.myShip.getViewportPixel(temp.pivotBySectorX, temp.pivotBySectorY);
      temp.viewportPixel.scaleX = (temp.viewportPixel.x * scale) + $g.viewport.shipPixelX - (scale * $g.viewport.shipPixelX);
      temp.viewportPixel.scaleY = (temp.viewportPixel.y * scale) + $g.viewport.shipPixelY - (scale * $g.viewport.shipPixelY);

      if (temp.viewportPixel.scaleX > $g.viewport.pixelWidth || temp.viewportPixel.scaleX < 0) return;
      if (temp.viewportPixel.scaleY > $g.viewport.pixelHeight || temp.viewportPixel.scaleY < 0) return;

      context.fillStyle = color;
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
