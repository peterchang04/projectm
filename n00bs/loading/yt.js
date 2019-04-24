var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video', {
    height: '1728',
    width: '3072',
    videoId: 'LBc6f9Y-je8',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  player.setPlaybackRate(.75);
  player.setPlaybackQuality('hd720');
  setTimeout(() => {
    var v = document.getElementById('composite');
    var promise = v.play();

    event.target.playVideo();
    startScript();
  }, 2000);
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    player.seekTo(0);
  }
}

const timings = {
  500: function() {
    $
  }
};

let currentTime = 0;
setInterval(() => {
  currentTime += 100;
  if (timings[currentTime]) {
    timings[currentTime]();
  }
}, 100);
