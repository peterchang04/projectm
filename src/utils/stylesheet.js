// generate and create in document custom stylesheet tags w/ styles
// will insert the styleId in <head> with id="{styleId}"
const temp = {};
function apply(styleId, styles = {}) {
  // see if this stylesheet exists
  temp.styleTag = document.getElementById(styleId);
  if (!temp.styleTag) {
    // setup stylesheet if it doesn't already exist
    temp.styleTag = document.createElement('style');
    temp.styleTag.id = styleId;
    temp.styleTag.setAttribute('info', 'generated_by_stylesheetjs');
    // WebKit hack :(
    temp.styleTag.appendChild(document.createTextNode(''));
    // append to doc
    document.head.appendChild(temp.styleTag);
  }

  // parse the style obj into styles
  temp.sheetHTML = '\n';
  Object.keys(styles).map((selector) => { // Object.keys maintains order
    temp.sheetHTML += `${selector} {\n`; // open tag
    Object.keys(styles[selector]).map((rule) => {
      temp.sheetHTML += `  ${rule}: ${styles[selector][rule]};\n`;
    });
    temp.sheetHTML += '}\n'; // close tag
  });
  temp.styleTag.innerHTML = temp.sheetHTML;
}

export default { apply };
