<template>
  <div id="players">
    <div class="player">
      <portrait1 class="portrait" />
      <div id="playerName">player 1</div>
      <button id="editButton">x</button>
    </div>
    <div class="player">
      <portrait2 class="portrait" />
      <div id="playerName">player 2</div>
      <button id="editButton">x</button>
    </div>
    <div class="player">
      <portrait3 class="portrait" />
      <div id="playerName">player 3</div>
      <button id="editButton">x</button>
    </div>
    <div class="player">
      <portrait4 class="portrait" />
      <div id="playerName">player 4</div>
      <button id="editButton">x</button>
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
    width: 38.5vw;
    height: 38.5vw;
    margin: 3vw;
    text-align: center;
    color: white;
    background-color: #295191;
  }
  .portrait {
    width: 34vw;
    height: 34vw;
    margin-top: 2.25vw;
    background-color: #295191;
  }
  #playerName {
    position: relative;
    font-size: 5.5vw;
    bottom: 7vw;
  }
  #editButton {
    position: relative;
    width: 6vw;
    height: 6vw;
    bottom: 41vw;
    left: 14vw;
    border: 2px solid white;
    border-radius: 3px;
    color: white;
    background-color: inherit;
    border-color: white;
  }
</style>
