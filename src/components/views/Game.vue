<template>
  <div id="game" :class="layoutString">
    <TargetsBar />
    <GameView />
    <RoleBar />

    <NoPanel v-if="currentRole === null"></NoPanel>

    <EngineerPanel v-if="currentRole === 0"></EngineerPanel>
    <EngineerPanelRight v-if="currentRole === 0"></EngineerPanelRight>

    <CaptainPanel v-if="currentRole === 1"></CaptainPanel>
    <CaptainPanelRight v-if="currentRole === 1"></CaptainPanelRight>

    <PilotPanel v-if="currentRole === 2"></PilotPanel>
    <PilotPanelRight v-if="currentRole === 2"></PilotPanelRight>

    <IntelPanel v-if="currentRole === 3"></IntelPanel>
    <IntelPanelRight v-if="currentRole === 3"></IntelPanelRight>

    <!-- <div id="gameDebug">
      <div>{{ layoutString }}</div>
      <div>{{ test }}</div>
      <div>{{ test2 }}</div>
    </div> -->

  </div>
</template>

<script>
  import TargetsBar from '../targetBar/TargetsBar.vue';
  import { mapState } from 'vuex';
  import RoleBar from '../roleBar/RoleBar.vue';
  import NoPanel from '../controls/NoPanel.vue';
  import EngineerPanel from '../controls/EngineerPanel.vue';
  import EngineerPanelRight from '../controls/EngineerPanelRight.vue';
  import CaptainPanel from '../controls/CaptainPanel.vue';
  import CaptainPanelRight from '../controls/CaptainPanelRight.vue';
  import PilotPanel from '../controls/PilotPanel.vue';
  import PilotPanelRight from '../controls/PilotPanelRight.vue';
  import IntelPanel from '../controls/IntelPanel.vue';
  import IntelPanelRight from '../controls/IntelPanelRight.vue';
  import GameView from '../GameView.vue';

  export default {
    name: 'game',
    components: {
      TargetsBar,
      RoleBar,
      NoPanel,
      EngineerPanel, EngineerPanelRight,
      CaptainPanel, CaptainPanelRight,
      PilotPanel, PilotPanelRight,
      IntelPanel, IntelPanelRight,
      GameView,
    },
    props: {
      msg: String
    },
    computed: {
      ...mapState([
        'currentRole',
        'thrusterValue',
        'layoutString',
        'test',
        'test2',
      ]),
    },
    methods: {
    },
    mounted() {
    },
  };
</script>

<!-- try to keep all responsive logic here -->
<style>
  .panelGrid {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(4, 25%);
    grid-template-rows: repeat(12, 8.3%);
    background-color: #21292f;
    box-shadow: 0 0 0.7em rgba(0, 0, 0, 0.8);
  }
  .panelGrid > div {
    height: 100%;
    width: 100%;
  }
  #game {
    height: 100%;
    position: relative;
  }

  .leftPanel {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: skewY(1.5deg);
    z-index: 1000;
  }
  .rightPanel {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: skewY(-1.5deg);
    z-index: 1000;
  }
  .phone-landscape #steering {
    width: 100%;
  }

  #gameDebug {
    position: fixed;
    width: 15%;
    height: 15%;
    top: 50%;
    left: 50%;
    margin-top: -7.5%;
    margin-left: -7.5%;
    z-index: 10000;
  }
</style>
