const scripts = {};

/* script functions
  damageHealth(percent);
  setTimer(seconds);
  setBlueScore(score); // set starting score
  setRedScore(score); // increments score by 1 per 3 seconds
  setWaypoint(letter, state); 0 = unclaimed, 1 = blue, 2 = red
*/


const players = {
  mei: {
    name: "MiniBoss",
    rank: 1
  },
  kevin: {
    name: "KevAndJane",
    rank: 4
  },
  roger: {
    name: "ItsPuddinTime",
    rank: 12
  },
  jebus: {
    name: "JebusChrist88",
    rank: 55
  }
};
scripts[1] = {
  0: () => {
    setTimer(600);
    setBlueScore(90);
    setRedScore(95);
    setWaypoint('a', 2, true);
    setWaypoint('b', 2, true);
    setWaypoint('c', 1, true);
  },
  2.5: () => {
    chat('mei', 'hellow world');
    damageTeamHealth(0, 20);
  },
  3: () => {
    damageHealth(100);
    damageTeamHealth(0, 30);
    chat('kevin', 'hellow world');
  },
  5: () => {
    setWaypoint('c', 0);
    damageTeamHealth(0, 101);
    chat('roger', 'hellow world');

  },
  5.2: () => {
    chat('jebus', 'Bod Gless you');
  },
  8: () => {
    damageTeamHealth(1, 101);
  },
  10.5: () => {
    setWaypoint('a', 2);
  },
  13:() => {
    player.seekTo(45);
  },
  15: () => {
    setWaypoint('c', 0);
  },
};

function startScript(key = 1) {
  for (let time in scripts[key]) {
    setTimeout(() => {
      scripts[key][time]();
    }, time * 1000);
  }
}

$(document).ready(function() {
});
