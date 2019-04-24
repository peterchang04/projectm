$(() => {
  setInterval(() => {
    updateIcons();
  }, 30);
  setInterval(() => {
    spinLoading();
  }, 130);
});

let oddTop = -56;
let evenTop = 28;
function updateIcons() {
  oddTop += .8;
  evenTop += .8;
  if (oddTop > 100) {
    oddTop = -56;
  }
  if (evenTop > 100) {
    evenTop = -56;
  }
  $('.class i.odd').css({ top: `${oddTop}%` });
  $('.class i.even').css({ top: `${evenTop}%` });
}

let heading = 0;
function spinLoading() {
  heading += 36;
  if (heading === 360) heading = 0;
  $('.loading').css({ transform: `rotate(${heading}deg)` });
}
