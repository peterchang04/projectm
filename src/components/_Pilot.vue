<template>
  <div id="pilot">
    <TargetsBar />
    <ShipView />
    <CrewBar />
    <Controls></Controls>
  </div>
</template>

<script>
  import TargetsBar from './TargetsBar.vue';
  import CrewBar from './CrewBar.vue';
  import Controls from './PilotControls.vue';
  import ShipView from './ShipView.vue';

  export default {
    name: 'pilot',
    components: { TargetsBar, CrewBar, Controls, ShipView },
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
