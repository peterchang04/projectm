<template>
  <div id="players">
    <div class="player player1">
      <portrait1 class="portrait" />
      <div id="playerName">X^X</div>
      <button id="cornerButton">x</button>
    </div>

    <div class="player player2">
      <portrait2 class="portrait" />
      <div id="playerName">player 2</div>
      <button id="cornerButton">x</button>
    </div>

    <div class="player player3">
      <portrait3 class="portrait" />
      <div id="playerName">player 3</div>
      <button id="cornerButton">x</button>
    </div>

    <div class="player player4">
      <portrait4 class="portrait" />
      <div id="playerName">player 4</div>
      <button id="cornerButton">x</button>
    </div>
  </div>
</template>

<script>
  import Portrait1 from '../../public/assets/svg/portraits/portrait1.svg';
  import Portrait2 from '../../public/assets/svg/portraits/portrait2.svg';
  import Portrait3 from '../../public/assets/svg/portraits/portrait3.svg';
  import Portrait4 from '../../public/assets/svg/portraits/portrait4.svg';

  export default {
    name: 'players',
    components: {
      Portrait1, Portrait2, Portrait3, Portrait4
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #players {
    width: 100%;
    height: auto;
  }
  #players .player {
    display: inline-block;
    position: relative;
    width: 47.5%;
    padding-top: 36%; /* aspect ratio */
    color: white;
    background-color: #295191;
    overflow: hidden;
    box-shadow: inset 0 0 0.2em rgba(0, 0, 0, 0.7);
    border-radius: 2%;
  }
  #players .player.player1, .player.player2 {
    margin-bottom: 5%;
  }
  #players .player.player1, .player.player3 {
    margin-right: 5%;
  }
  #players .portrait {
    position: absolute;
    top: 7%;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.3);
  }
  #playerName {
    position: absolute;
    width: 100%;
    font-size: 0.7em;
    bottom: 1%;
    text-shadow: 0 0 0.2em rgba(0, 0, 0, .7);
    font-weight: bold;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  #cornerButton {
    position: absolute;
    width: 15%;
    height: 15%;
    top: 6%;
    right: 6%;
    border: 2px solid white;
    border-radius: 3px;
    color: white;
    background-color: inherit;
    border-color: white;
  }
</style>
