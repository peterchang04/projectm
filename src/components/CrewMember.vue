<template>
  <div class="crewMember" v-bind:class="{ odd: index % 2 }">
    <div v-if="role === 'captain'" class="captain">
      <IconCaptain class="roleIcon" />
      <Portrait1 class="portrait" />
    </div>

    <div v-if="role === 'intel'" class="intel">
      <IconIntel class="roleIcon" />
      <portrait2 class="portrait" />
    </div>

    <div v-if="role === 'engineer'" class="engineer">
      <IconEngineer class="roleIcon" />
      <Portrait3 class="portrait" />
    </div>

    <div v-if="role === 'pilot'" class="pilot">
      <IconPilot class="roleIcon" />
      <Portrait4 class="portrait" />
    </div>

    <span class="role">{{ role }}</span>
  </div>
</template>

<script>
  import IconCaptain from './svg/icon/captain.vue';
  import IconIntel from './svg/icon/intel.vue';
  import IconEngineer from './svg/icon/engineer.vue';
  import IconPilot from './svg/icon/pilot.vue';
  import Portrait1 from './svg/portrait/portrait1.vue';
  import Portrait2 from './svg/portrait/portrait2.vue';
  import Portrait3 from './svg/portrait/portrait3.vue';
  import Portrait4 from './svg/portrait/portrait4.vue';

  export default {
    name: 'crewBar',
    components: {
      IconCaptain, IconIntel, IconEngineer, IconPilot,
      Portrait1, Portrait2, Portrait3, Portrait4
    },
    props: {
      role: String,
      index: Number,
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* All sizes in vw to preserve proportions across different resolutions */
  .crewMember {
    font-size: 3vw;
    color: #ddd;
    text-transform: uppercase;
    background-color: #313131;
    position: relative;
    overflow: hidden;
  }
  .crewMember.odd {
    background-color: #151515;
  }

  .crewMember .role {
    z-index: 1150;
    text-align: center;
    position: absolute;
    top: .5vw;
    right: .8vw;
    width: 12vw
  }

  .crewMember .portrait {
    position: absolute;
    left: 0vw;
    top: -.5vw;
    height: 15vw;
    width: auto;
    z-index: 1120;
  }

  .crewMember .roleIcon {
    position: absolute;
    bottom: 1.1vw;
    height: 6vw;
    width: auto;
    right: 3.7vw;
  }

  .crewMember > div {
    height: 100%;
  }

  .crewMember .engineer {
    background-color: #253822;
  }

  .crewMember .captain {
    background-color: #414225;
  }

  .crewMember .pilot {
    background-color:#3e2323;
  }

  .crewMember .intel {
    background-color: #2e2e40;
  }

  .crewMember .engineer .roleIcon {
    fill: #5ea726;
  }
  .crewMember .captain .roleIcon {
    fill: #d6b752;
  }
  .crewMember .pilot .roleIcon {
    fill: #e54646;
  }
  .crewMember .intel .roleIcon {
    fill: #3c87cf;
  }
</style>
