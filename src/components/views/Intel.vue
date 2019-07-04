<template>
  <div id="intel">
    <TargetsBar />
    <GameView />
    <RoleBar />
    <!-- <Controls></Controls> -->
    <div class="temp">Intel</div>
  </div>
</template>

<script>
  import TargetsBar from '../targetBar/TargetsBar.vue';
  import RoleBar from '../roleBar/RoleBar.vue';
  // import Controls from '../controls/PilotControls.vue';
  import GameView from '../GameView.vue';

  export default {
    name: 'intel',
    components: { TargetsBar, RoleBar, /* Controls , */GameView },
    props: {
      msg: String
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #intel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
