<template>
  <div id="intel">
    <TargetsBar />
    <GameView />
    <RoleBar />
    <NoPanel v-show="currentRole === null"></NoPanel>
    <EngineerPanel v-show="currentRole === 0"></EngineerPanel>
    <CaptainPanel v-show="currentRole === 1"></CaptainPanel>
    <PilotPanel v-show="currentRole === 2"></PilotPanel>
    <IntelPanel v-show="currentRole === 3"></IntelPanel>
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
  import { mapState } from 'vuex'

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
      GameView
    },
    props: {
      msg: String
    },
    computed: mapState (['currentRole']),
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
