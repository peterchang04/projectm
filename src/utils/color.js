import perf from './perf.js';

const temp = {};
// from projectmrest
function toRGBA(colorString) { perf.start('color.toRGBA');
  colorString = colorString.toLowerCase().replace(/\s+/g,''); // strip spaces and lcase
  if (isHex(colorString)) temp.response = hexToRGBA(colorString);
  if (isRGB(colorString)) temp.response = rgbToRGBA(colorString);
  if (isRGBA(colorString)) temp.response = colorString;
  perf.stop('color.toRGBA');
  return temp.response;
  throw new Error(`Color Transformation error. ${colorString} is not a valid color`);
}

function isRGBA(colorString) {
  return (colorString.substring(0, 5) === 'rgba(');
}

function isRGB(colorString) {
  return (colorString.substring(0, 4) === 'rgb(');
}

function isHex(colorString) {
  return (colorString.charAt(0) === '#');
}

function hexToRGBA(hex) { perf.start('color.hexToRGBA');
  temp.opacity = 1;
  if (hex.length === 9) {
    temp.opacity = Math.round(100 * parseInt(hex.slice(7, 9), 16) / 255) / 100;
    hex = hex.substring(0, 7);
  }
  // fix 3 char hexs #fff
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    temp.c = hex.substring(1).split('');
    if (temp.c.length === 3){
        temp.c= [temp.c[0], temp.c[0], temp.c[1], temp.c[1], temp.c[2], temp.c[2]];
    }
    temp.c = '0x' + temp.c.join('');
    temp.result = 'rgba(' + [(temp.c>>16)&255, (temp.c>>8)&255, temp.c&255].join(',') + `,${temp.opacity})`;
    perf.stop('color.hexToRGBA');
    return temp.result;
  }
  perf.stop('color.hexToRGBA');
  throw new Error('Bad Hex');
}

function rgbToRGBA(rgbString) { perf.start('color.rgbToRGBA');
  temp.result = `rgba${rgbString.substring(3, rgbString.length-1)},1)`;
  perf.stop('color.rgbToRGBA');
  return temp.result;
}

export default { toRGBA };
