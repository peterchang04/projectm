<template>
  <div id="pilot">
    <TargetsBar />
    <GameView />
    <CrewBar />
    <Controls></Controls>
  </div>
</template>

<script>
  import TargetsBar from '../targetBar/TargetsBar.vue';
  import CrewBar from '../crewBar/CrewBar.vue';
  import Controls from '../controls/PilotControls.vue';
  import GameView from '../GameView.vue';

  export default {
    name: 'pilot',
    components: { TargetsBar, CrewBar, Controls, GameView },
    props: {
      msg: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pilot {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
