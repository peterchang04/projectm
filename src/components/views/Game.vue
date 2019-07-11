<template>
  <div id="intel">
    <TargetsBar />
    <GameView />
    <RoleBar />
    <NoControls v-if="currentRole === null"></NoControls>
    <EngineerControls v-if="currentRole === 0"></EngineerControls>
    <CaptainControls v-if="currentRole === 1"></CaptainControls>
    <PilotControls v-if="currentRole === 2"></PilotControls>
    <IntelControls v-if="currentRole === 3"></IntelControls>
  </div>
</template>

<script>
  import TargetsBar from '../targetBar/TargetsBar.vue';
  import RoleBar from '../roleBar/RoleBar.vue';
  import NoControls from '../controls/NoControls.vue';
  import EngineerControls from '../controls/EngineerControls.vue';
  import CaptainControls from '../controls/CaptainControls.vue';
  import PilotControls from '../controls/PilotControls.vue';
  import IntelControls from '../controls/IntelControls.vue';
  import GameView from '../GameView.vue';

  export default {
    name: 'intel',
    components: {
      TargetsBar,
      RoleBar,
      NoControls,
      EngineerControls,
      CaptainControls,
      PilotControls,
      IntelControls,
      GameView
    },
    props: {
      msg: String
    },
    computed: {
      currentRole() {
        return this.$store.state.currentRole;
      }
    },
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
