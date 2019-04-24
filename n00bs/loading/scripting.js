var scripts = {};
scripts[1] = {
  0: () => {
    changeClass(1, 0);
    changeClass(2, 0);
    changeClass(3, 0);
    changeClass(4, 0);
  },
  1: () => {
    $('#overlay').fadeOut(2000);
    loadPlayer(1);

  },
  2: () => {
  },
  4: () => {
  },
  5: () => {
    loadPlayer(2);
  },
  7: () => {
    changeClass(2, 1);
  },
  7.5: () => {
    ready(2);
  },
  8.5: () => {
  },
  9.5: () => {
  },
  10.5: () => {
    loadPlayer(3);
  },
  12: () => {
    changeClass(3, 2);
  },
  13: () => {
    changeClass(3, 0);
  },
  14: () => {
    changeClass(1, 2);
  },
  14.5: () => {
  },
  15: () => {
    changeClass(1, 0);
    changeClass(3, 2);
  },
  16: () => {
    ready(1);
  },
  17.5: () => {
    ready(3);
  },
  19: () => {
    loadPlayer(4);
  },
  20: () => {
    changeClass(4, 2);
  },
  21: () => {
    changeClass(4, 1);
  },
  23: () => {
    ready(4);
  },
  23.5: () => {
    countdown();
    $('#blastervilleLogo').animate({ opacity: 1 }, 1000);
  }
};

function startScript(key = 1) {
  for (let time in scripts[key]) {
    setTimeout(() => {
      scripts[key][time]();
    }, time * 1000);
  }
}

const players = {
  1: {
    kills: 21599,
    ratio: 5.9,
    ratio2: 1,
    wins: 975
  },
  2: {
    kills: 113314,
    ratio: 8.4,
    ratio2: 1,
    wins: 4231
  },
  3: {
    kills: 4132,
    ratio: 1.8,
    ratio2: 1,
    wins: 343
  },
  4: {
    kills: 0,
    ratio: 0,
    ratio2: 0,
    wins: 0
  }
};

// TODOS
// DIALOG, THE THERAPIST TYPES SOMETHING
// READY EVENTS
// STARTING 3, 2, 1
// TWEAK TIMING b

function loadPlayer(playerNumber) {
  $(`.player${playerNumber}`).addClass('in');
  setTimeout(() => {
    loadKills(playerNumber);
  }, 500);
  setTimeout(() => {
    loadRatio(playerNumber);
  }, 1000);
  setTimeout(() => {
    loadWins(playerNumber);
  }, 1500);
}

function loadKills(playerNumber) {
  $(`.player${playerNumber} .kills`).fadeIn();
  let current = 0;
  for (var i = 0; i < 60; i++) {
    setTimeout(() => {
      current += (players[playerNumber].kills / 60);
      if (current > 4000) {
        $(`.player${playerNumber} .kills`).addClass('lvl1');
      }
      if (current > 40000) {
        $(`.player${playerNumber} .kills`).addClass('lvl2');
      }
      $(`.player${playerNumber} .kills div:last`).text(comma(Math.floor(current)));
    }, 51 * i);
  }
  if (players[playerNumber].kills > 50000) {
    $(`.player${playerNumber} .skullz`).addClass('lots');
  } else if (players[playerNumber].kills > 20000) {
    $(`.player${playerNumber} .skullz`).addClass('some');
  } else if (players[playerNumber].kills > 4000) {
    $(`.player${playerNumber} .skullz`).addClass('few');
  }
}

function loadRatio(playerNumber) {
  $(`.player${playerNumber} .ratio`).fadeIn();
  let current = 0;
  let count = players[playerNumber].ratio / .1;
  for (var i = 0; i < count; i++) {
    setTimeout(() => {
      current += .1;
      if (current > 4) {
        $(`.player${playerNumber} .ratio`).addClass('lvl1');
      }
      if (current > 7) {
        $(`.player${playerNumber} .ratio`).addClass('lvl2');
      }
      $(`.player${playerNumber} .ratio div:last`).text(`${current.toFixed(1)} : ${players[playerNumber].ratio2}`);
    }, 52 * i);
  }
}

function loadWins(playerNumber) {
  $(`.player${playerNumber} .wins`).fadeIn();
  let current = 0;
  for (var i = 0; i < 60; i++) {
    setTimeout(() => {
      current += (players[playerNumber].wins / 60);
      if (current > 500) {
        $(`.player${playerNumber} .wins`).addClass('lvl1');
      }
      if (current > 1000) {
        $(`.player${playerNumber} .wins`).addClass('lvl2');
      }
      $(`.player${playerNumber} .wins div:last`).text(comma(Math.floor(current)));
    }, 53 * i);
  }
}

function comma(number) {
  if (number >= 1000) {
    const str = number.toFixed(0);
    return `${str.substring(0, str.length - 3)},${str.substring(str.length - 3, number.length)}`;
  }
  return number;
}
// 0: tank, 1: dps, 2: healer
function changeClass(pNumber, classId) {
  const $class = $(`.player${pNumber} .class`);
  const $span = $class.find('span:first');

  $span.animate({top: '97px'}, 400, function(){
    $class.find('i').removeClass('fa-shield-alt').removeClass('fa-crosshairs').removeClass('fa-plus-circle');
    $class.removeClass('dps').removeClass('tank').removeClass('heals');
    if (classId === 0) {
      $span.text('TANK');
      $class.find('i').addClass('fa-shield-alt');
      $class.addClass('tank');
    } else if (classId === 1) {
      $span.text('DPS');
      $class.find('i').addClass('fa-crosshairs');
      $class.addClass('dps');
    } else {
      $span.text('HEALER');
      $class.find('i').addClass('fa-plus-circle');
      $class.addClass('heals');
    }
    $span.css({top: '-85px'}).animate({ top: '0px'});
  });
}

function countdown() {
  $('#overlay').css({ opacity: 0, display: 'block' });
  $('#overlay').animate({ opacity: .7 }, 1000);
  $('#view').css({ filter: 'blur(1px)'});
  setTimeout(() => {
    $('#view').css({ filter: 'blur(2px)'});
  }, 500);
  setTimeout(() => {
    $('#view').css({ filter: 'blur(3px)'});
  }, 1000);
  setTimeout(() => {
    $('#view').css({ filter: 'blur(4px)'});
  }, 1500);

  $('#countdown').addClass('start');
  setTimeout(() => {
    $('#countdown').removeClass('start').addClass('end');
  }, 500);
  setTimeout(() => {
    $('#countdown').removeClass('end').addClass('start');
  }, 1200);
  setTimeout(() => {
    $('#countdown').text(2).removeClass('start').addClass('end');
  }, 1500);
  setTimeout(() => {
    $('#countdown').removeClass('end').addClass('start');
  }, 2200);
  setTimeout(() => {
    $('#countdown').text(1).removeClass('start').addClass('end');
  }, 2500);
  setTimeout(() => {
    $('#countdown').removeClass('end').addClass('start');
    $('#overlay').animate({ opacity: 1 }, 1000);
  }, 3200);
  setTimeout(() => {
    $('#countdown').text('START').removeClass('start').addClass('end');
    $('#overlay').animate({ backgroundColor: 'rgb(255,255,255)' }, 5000);
  }, 3500);
}

function ready(p) {
  $(`.player${p}`).addClass('go');
}
