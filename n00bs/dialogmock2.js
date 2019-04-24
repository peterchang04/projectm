const scripts = {};

/* script functions
  damageHealth(percent);
  setTimer(seconds);
  setBlueScore(score); // set starting score
  setRedScore(score); // increments score by 1 per 3 seconds
  setWaypoint(letter, state); 0 = unclaimed, 1 = blue, 2 = red
*/


let players = {
  // BLUE TEAM
  mei: {
    name: "MiniBoss",
    rank: 1,
    team: 'blue'
  },
  kevin: {
    name: "KevAndJane637",
    rank: 4,
    team: 'blue'
  },
  roger: {
    name: "ItsPuddinTime",
    rank: 12,
    team: 'blue'
  },
  therapist: {
    name: "TheTherapist",
    rank: 60,
    team: 'blue'
  },
  // RED TEAM
  jebus: {
    name: "JebusChrist88",
    rank: 55,
    team: 'red'
  },
  thugwife: {
    name: "Thug_W1fe",
    rank: 46,
    team: 'red'
  },
  salty: {
    name: "SaltyPr3t33n",
    rank: 33,
    team: 'red'
  },
  obama: {
    name: "Obamahope",
    rank: 11,
    team: 'red'
  }
};
scripts[1] = {
  // starting condition
  0: () => {
    setTimer(69);
    setBlueScore(45);
    setRedScore(47);
    setWaypoint('a', 2, true);
    setWaypoint('b', 2, true);
    setWaypoint('c', 1, true);
    // actionFeed('Game Begin');
    chat('thugwife', 'eat lead leadeater');
    chat('salty', 'obama is TKingg!!!');
    chat('obama', 'shut yo mouth son');
    chat('therapist', 'anger is a mismanagement of creativity');
  },
  1.5: () => {
    damageHealth(15);
  },
  2: () => {
    killFeed('therapist', 'salty', `$killer made $victim swiss cheese`);
  },
  2.5: () => {
    damageTeamHealth(0, 20);
  },
  3: () => {
    damageHealth(30);
    damageTeamHealth(0, 30);
    chat('kevin', 'watch the language, kids play this game');
  },
  3.5: () => {
    setWaypoint('c', 3);
    damageTeamHealth(0, 15);
  },
  4: () => {
    damageHealth(30);
  },
  4.5: () => {
    damageTeamHealth(2, 60);
  },
  5: () => {
    damageTeamHealth(1, 15);

  },
  5.2: () => {
    chat('jebus', 'Bod Gless you');
  },
  6: () => {
    killFeed('kevin', 'obama', `$killer just fucked $victim's left eye socket`);
  },
  7: () => {
    setWaypoint('c', 0);
  },
  8: () => {
    damageTeamHealth(2, 15);
  },
  10.5: () => {
    killFeed('jebus', 'roger');
  },
  11: () => {
    damageTeamHealth(1, 100);
    chat('jebus', 'Peace be with you my son');
  },
  12: () => {

  },
  15: () => {
    damageTeamHealth(0, 10);
    damageTeamHealth(2, 15);
  },
  15.5: () => {
    killFeed('mei', 'salty');
  },
  17: () => {
    damageHealth(10);
    chat('obama', 'Whoa is that MiniBoss from ShockerStyle?');
  },
  18: () => {
    setWaypoint('c', 2);
  },
  19: () => {
    damageTeamHealth(0, 10);
  },
  21: () => {
    killFeed('kevin', 'obama');
  },
  24: () => {
    killFeed('obama', 'mei');
    damageHealth(30);
  },
  25: () => {
    damageTeamHealth(1, 20);
    chat('thugwife', 'Probably some smurf. Missing clan tags');
  },
  26: () => {
    killFeed('obama', 'therapist');
    damageTeamHealth(2, 15);
  },
  27.5: () => {
    damageTeamHealth(1, 20);
    setWaypoint('a', 0);
    chat('therapist', 'I am in denial of my own death lol');
  },
  28: () => {
  },
  30: () => {

  },
  31: () => {
    killFeed('thugwife', 'kevin');
    damageTeamHealth(0, 20);
  },
  33: () => {
    setWaypoint('a', 1);
    damageTeamHealth(1, 50);
    chat('jebus', 'I am risen');
  },
  35: () => {
    damageTeamHealth(1, 20);
    killFeed('salty', 'kevin');
  },
  35.5: () => {
  },
  41: () => {
    killFeed('roger', 'salty');
  },
  43: () => {
    damageTeamHealth(0, 10);
    chat('salty', 'Lucky shot puddin. Or aimbots');
  },
  44: () => {

  },
  44.5: () => {
    damageTeamHealth(0, 10);
    chat('jebus', 'I love you!!');
    chat('jebus', 'I love you!!');
  },
  45: () => {
    damageTeamHealth(2, 15);
  },
  47: () => {
    killFeed('mei', 'obama');
    chat('obama', 'die birther');
  },
  48: () => {
    damageTeamHealth(1, 15);
    killFeed('mei', 'thugwife');
  },
  50: () => {
    damageTeamHealth(1, 20);
  },
  51: () => {
    damageHealth(15);
  },
  52: () => {
    setWaypoint('a', 0);
  },
  53: () => {
    damageHealth(10);
  },
  55: () => {

  },
  55.5: () => {
    damageTeamHealth(0, 10);
  },
  56: () => {

  },
  58: () => {
    damageTeamHealth(1, 20);
  },
  59: () => {
    setWaypoint('a', 2);
    killFeed('kevin', 'jebus');
  },
  60: () => {
    damageTeamHealth(1, 40);
  },
  61: () => {
    damageHealth(10);

  },
  61.5: () => {

  },
  63: () => {
    damageTeamHealth(2, 15);
    chat('therapist', 'GG');
  },
  64: () => {
    damageHealth(10);
    chat('obama', 'GG');
    killFeed('kevin', 'obama');
  },
  66: () => {
    killFeed('obama', 'roger');
    damageTeamHealth(1, 10);
  },
  66.5: () => {
    chat('obama', 'yall make me laugh');

  },
  68: () => {
    damageHealth(10);
    chat('jebus', 'As it is written. Amen.');
  },
  // 8: () => {
  //   damageTeamHealth(1, 30);
  // },
  // 10.5: () => {
  //   setWaypoint('a', 2);
  // },
  // 13:() => {
  //   player.seekTo(45);
  // },
  // 15: () => {
  //   setWaypoint('c', 0);
  // },
};

const players2 = {
  // BLUE TEAM
  mei: {
    name: "MiniBoss",
    rank: 1,
    team: 'blue'
  },
  kevin: {
    name: "KevAndJane637",
    rank: 4,
    team: 'blue'
  },
  roger: {
    name: "ItsPuddinTime",
    rank: 12,
    team: 'blue'
  },
  therapist: {
    name: "TheTherapist",
    rank: 60,
    team: 'blue'
  },
  // RED TEAM
  donglover: {
    name: "WhiteDonGlover",
    rank: 12,
    team: 'red'
  },
  sister: {
    name: "[JFK]YourSister69",
    rank: 44,
    team: 'red'
  },
  commando: {
    name: "[JFK]CommandoBen",
    rank: 33,
    team: 'red'
  },
  shrunk: {
    name: "PoolShrinkage",
    rank: 27,
    team: 'red'
  }
};

scripts[2] = {
  0: () => {
    players = players2;
    setWaypoint('a', 1, true);
    setWaypoint('b', 2, true);
    setWaypoint('c', 1, true);
    setTimer(254);
    setBlueScore(33);
    setRedScore(24);
    damageTeamHealth(0, 75);
    chat('therapist', 'I got one');
    chat('commando', 'All your base and shit');
    chat('shrunk', 'Nice shot MiniBoss LOLZ');
    chat('shrunk', 'EAT SHIT AND DYE!!!');
    chat('shrunk', 'EAT SHIT AND DYE!!!');
    chat('shrunk', 'EAT SHIT AND DYE!!!');
  },
  1: () => {

    damageTeamHealth(1, 30);
  },
  2: () => {
    chat('roger', 'You dont know me.');
  },
  3: () => {
    // kevin gets a kill
    damageTeamHealth(2, 30);
    damageHealth(15);
    killFeed('kevin', 'donglover', `$killer made a mess of $victim's face`);
  },
  4: () => {
    // mei gets a kill
    damageHealth(15);
    damageTeamHealth(2, 50);
    killFeed('mei', 'sister', `$killer's perforated most of $victim's organs`);
  },
  4.5: () => {
    chat('sister', 'OMG MiniBoss is hax');
  },
  5: () => {
    damageTeamHealth(1, 15);
  },
  6: () => {
    // red team captures A
    setWaypoint('a', 2);
  },
  6.5: () => {
    damageHealth(15);
    damageTeamHealth(1, 100);
  },
  7: () => {
    // roger dies
    killFeed('shrunk', 'roger', `$killer fells terrible for killing $victim (NOT)`);
  },
  9: () => {
    damageTeamHealth(0, 100);
  },
  9.5: () => {
    // mei dies
    killFeed('commando', 'mei', `$killer took $victim's life AND dignity`);
  },
  11.5: () => {
    damageHealth(100);
  },
  12: () => {
    chat('commando', 'I pwnd Miniboss LOLZ');
    // kevin dies
    killFeed('shrunk', 'roger', `$killer left no remains of $victim to teabag`);
  },
  15: () => {
    // red team captures C
    setWaypoint('c', 2);
    $('#respawnTimer').fadeOut();
    setTimeout(() => {
      $('#respawnTimer').fadeIn();
    }, 2000);
  }
};

scripts[3] = {
  0: () => {
    players = players2;
    setWaypoint('a', 2, true);
    setWaypoint('b', 2, true);
    setWaypoint('c', 1, true);
    setTimer(19);
    setBlueScore(94);
    setRedScore(88);
    damageTeamHealth(0, 75);
    damageHealth(30);
    killFeed('kevin', 'donglover', `$killer made a mess of $victim's face'`);
    chat('therapist', 'MiniBoss did you quit ShockerStyle!?');
    killFeed('mei', 'sister', `$killer's perforated most of $victim's organs`);
    chat('shrunk', 'JFK > MiniBoss!!!');
    chat('shrunk', 'JFK > MiniBoss!!!');
  },
  2: () => {
    chat('therapist', 'WE GOT THIS');
  },
  3.5: () => {
    damageTeamHealth(0, 10);
    chat('mei', 'defend A');
  },
  4: () => {
    damageTeamHealth(2, 30);
    killFeed('mei', 'donglover', `$killer pities $victim's mother`);
  },
  6: () => {
    damageTeamHealth(1, 15);
    damageTeamHealth(2, 30);
  },
  7: () => {
    chat('mei', 'Nice faceplant DongLover');
  },
  7.5: () => {
    damageTeamHealth(2, 100);
  },
  8: () => {
    killFeed('commando', 'therapist', `$killer found no remains of $victim to teabag`);
  },
  8.5: () => {
    damageHealth(15);
    killFeed('mei', 'sister', `$killer finds $victim's innards to be quite lovely`);
  },
  9: () => {
    damageTeamHealth(1, 10);
  },
  10.5: () => {
    chat('donglover', 'Its Don Glover damnit');
  },
  14: () => {
    setWaypoint('c', 0);
  },
  16: () => {
    chat('commando', 'w00t w00t!! Allurbase suckas');
    chat('commando', 'w00t w00t!! Allurbase suckas');
  },
  17: () => {
    chat('sister', '[JFK] foreva');
  }
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
