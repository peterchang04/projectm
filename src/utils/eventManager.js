// allows for namespaced events, much like jquery functionality

function add(el, name, fn) { // i.e. click.me, click.hello
  if (!validateName(name)) return;
  if (!el) el = document.documentElement; // default el
  initEl(el);
  const nameArray = name.toLowerCase().split('.');
  // if base event doesn't exist, add it
  if (!(nameArray[0] in el.eventManagerTypes)) {
    el.addEventListener(nameArray[0], function(e) {
      // call all namespaced functions of for this event
      for (let namespace in el.eventManagerTypes[nameArray[0]]) {
        el.eventManagerTypes[nameArray[0]][namespace](e);
      }
    });
    el.eventManagerTypes[nameArray[0]] = {};
  }

  // add namespaced function to event
  el.eventManagerTypes[nameArray[0]][nameArray[1]] = fn;
}

function remove(el, name, fn) { // i.e. click.me, click.hello
  if (!validateName(name)) return;
  if (!el) el = document.documentElement; // default el
  if (!el.eventManagerTypes) return; // nothing to remove
  const nameArray = name.toLowerCase().split('.');
  delete el.eventManagerTypes[nameArray[0]][nameArray[1]];
}

function initEl(el) {
  if (!el.eventManagerTypes) el.eventManagerTypes = {};
}

function validateName(name = '') {
  if (name.split('.').length === 2) return true;
  console.warn(`${name} is not valid. Must be {event}.{namespace} e.g. click.hello`);
  return false;
}

export default { add, remove };
