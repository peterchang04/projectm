import perf from '../../utils/perf.js';
import entity from './_entity.js';
import physics from './_physics.js';
import drawable from './_drawable.js';
import updatable from './_updatable.js';
import settersAndHooks from './_settersAndHooks.js';
import collidable from './_collidable.js';
import shipThrust from './_shipThrust.js';
import shipWeapons from './_shipWeapons.js';

const temp = {};

// file all decorators here by load order
const decorators = [
  // foundations
  { name: 'entity', ...entity },
  { name: 'drawable', ...drawable },
  { name: 'updatable', ...updatable },
  { name: 'settersAndHooks', ...settersAndHooks },
  // game mechanics
  { name: 'physics', ...physics },
  { name: 'collidable', ...collidable },
  // ship systems
  { name: 'shipThrust', ...shipThrust },
  { name: 'shipWeapons', ...shipWeapons },
];

// run the check
check();

function check() { perf.start('decorate.check');
  const testObj = { id: -1 };
  decorators.map((decorator) => {
    // check for 'add' function
    if (typeof decorator.add !== 'function') return console.warn(`decorator: ${decorator.name} missing add()`);
    // check for 'add' function
    if (typeof decorator.getProperties !== 'function') return console.warn(`decorator: ${decorator.name} missing getProperties()`);
    // check properties
    temp.properties = decorator.getProperties();
    if (typeof temp.properties !== 'object') return console.warn(`${decorator.name}.getProperties() should return object`);
    // make sure properties aren't overlapping (don't already exist in testObj)
    Object.keys(temp.properties).map((key) => {
      if (key in testObj) console.warn(`${decorator.name}.${key} already defined by another decorator`);
    });
    // apply decorator to obj
    decorator.add(testObj);
  });
  perf.stop('decorate.check');
}

function add(obj, initialObj = {}, entities = []) { perf.start('decorate.add'); // entities example: [ 'drawable', 'updatable', 'physics' ]
  // overlay initialObj AFTER all decorators applied
  temp.obj = new Object();
  temp.obj.id = $g.game.newId();

  decorators.map((decorator) => { // install in the order listed in 'decorators' array
    if (entities.indexOf(decorator.name) >= 0) {
      decorator.add(temp.obj);
      // remove the used decorator from entities argument
      entities.splice(entities.indexOf(decorator.name), 1);
    }
  });
  // if anything left in entities argument, probably typo
  if (entities.length) console.warn(`${JSON.stringify(entities)} weren't valid decorators. Typo much?`);

  // assign initial obj, so type can be set, which init() probably needs
  Object.assign(obj, temp.obj, initialObj);
  perf.stop('decorate.add');
  return obj;
}

export default { add };
