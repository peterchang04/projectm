<template>
  <div id="players">
    <div class="player">
      <portrait1 class="portrait" />
      <div id="playerName">X^X</div>
      <button id="cornerButton">x</button>
    </div>
    <div class="player">
      <portrait2 class="portrait" />
      <div id="playerName">player 2</div>
      <button id="cornerButton">x</button>
    </div>
    <div class="player">
      <portrait3 class="portrait" />
      <div id="playerName">player 3</div>
      <button id="cornerButton">x</button>
    </div>
    <div class="player">
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
<style scoped>
  .player {
    display: inline-block;
    position: relative;
    width: 38.5vw;
    height: 38.5vw;
    margin: 3vw;
    text-align: center;
    color: white;
    background-color: #295191;
  }
  .portrait {
    position: absolute;
    top: 6%;
    left: 6%;
    width: 88%;
    height: 88%;
    background-color: #295191;
  }
  #playerName {
    position: absolute;
    width: 88%;
    margin-left: 6%;
    font-size: 120%;
    bottom: 8%;
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
    text-align: center;
  }
</style>
