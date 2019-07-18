<template>
  <div id="intel">
    <TargetsBar />
    <GameView />
    <RoleBar />
    <NoPanel v-if="currentRole === null"></NoPanel>
    <EngineerPanel v-if="currentRole === 0"></EngineerPanel>
    <CaptainPanel v-if="currentRole === 1"></CaptainPanel>
    <PilotPanel v-if="currentRole === 2"></PilotPanel>
    <IntelPanel v-if="currentRole === 3"></IntelPanel>

    <!-- TOP LAYER -->
    <PilotSteering :class="{ hide: currentRole !== 2 }" />
  </div>
</template>

<script>
  import TargetsBar from '../targetBar/TargetsBar.vue';
  import RoleBar from '../roleBar/RoleBar.vue';
  import NoPanel from '../controls/NoPanel.vue';
  import EngineerPanel from '../controls/EngineerPanel.vue';
  import CaptainPanel from '../controls/CaptainPanel.vue';
  import PilotPanel from '../controls/PilotPanel.vue';
  import IntelPanel from '../controls/IntelPanel.vue';
  import GameView from '../GameView.vue';
  import PilotSteering from '../controls/PilotSteering.vue';

  export default {
    name: 'intel',
    components: {
      TargetsBar,
      RoleBar,
      NoPanel,
      EngineerPanel,
      CaptainPanel,
      PilotPanel,
      IntelPanel,
      GameView,
      PilotSteering,
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
  .hide {
    z-index: -1;
    visibility: hidden;
  }
</style>
