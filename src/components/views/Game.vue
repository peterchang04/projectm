<template>
  <div id="game">
    <TargetsBar />
    <GameView />
    <RoleBar />
    <NoPanel v-if="currentRole === null"></NoPanel>
    <EngineerPanel v-if="currentRole === 0"></EngineerPanel>
    <CaptainPanel v-if="currentRole === 1"></CaptainPanel>
    <PilotPanel v-if="currentRole === 2"></PilotPanel>
    <IntelPanel v-if="currentRole === 3"></IntelPanel>

    <span id="test">{{ thrusterValue }}</span>
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

  export default {
    name: 'game',
    components: {
      TargetsBar,
      RoleBar,
      NoPanel,
      EngineerPanel,
      CaptainPanel,
      PilotPanel,
      IntelPanel,
      GameView,
    },
    props: {
      msg: String
    },
    computed: {
      currentRole() {
        return this.$store.state.currentRole;
      },
      thrusterValue() {
        return this.$store.state.thrusterValue;
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #test {
    position: absolute;
    left: 15vw;
    top: 15vw;
    z-index:3000;
    color: white;
  }
  #game {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>
