import { cloneDeep } from 'lodash';
const temp = {};
/* list all used properties here. Used to cross-reference check in decorate.js & set defaults */
const properties = {
  temp: {}, // for temp calculation space
  inits: [], // function names to init with, populated by other decorators probably
  type: 0, // type support
};

function getProperties() {
  return properties;
}

function add(obj) {
  Object.assign(obj, cloneDeep(properties)); // merge properties
  obj.init = init;
}

function init(initialObj) { // run own init functions
  // add it to a queue if it isn't already there
  if (!(this.id in $g.game[whichQueue[this.constructor.name]])) {
    $g.game[whichQueue[this.constructor.name]][this.id] = this;
  }
  console.log(initialObj);
  // apply initialObj to this
  Object.assign(this, initialObj); // merge properties

  this.applyType();
  // run init functions
  this.inits.map((word) => {
    this[word](initialObj);
  });
}

const whichQueue = { // given a classname, which queue does it belong in?
  Asteroid: 'actors',
  Ship: 'actors',
  Projectile: 'projectiles',
  Particle: 'particles',
};

export default { add, getProperties };
