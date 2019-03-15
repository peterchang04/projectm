let id = 0;
let pi2 = Math.PI * 2; // pre calculate

function add(obj) {
  obj.id = newId();
  obj.update = function () {
    if (!obj.updates) return;

    obj.updates.forEach((word) => {
      // console.log(obj.id, word, obj);
      obj[word]();
    });

  };
  obj.updates = [];
  obj.draw = function(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.w, 0, pi2);
    context.fillStyle = '#fff';
    context.fill();
  }
}

function newId() {
  return id++;
}

export default { add };
