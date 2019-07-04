<template>
  <div class="role" v-bind:class="{ odd: index % 2 }">
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

    <router-link v-if="$route.path !== `/${role}`" class="roleLink" :to="`/${role}`"></router-link>
    <span class="roleText">{{ role }}</span>
  </div>
</template>

<script>
  import IconCaptain from '../../../public/assets/svg/roleIcons/medal.svg';
  import IconPilot from '../../../public/assets/svg/roleIcons/pilot.svg';
  import IconEngineer from '../../../public/assets/svg/roleIcons/wrench.svg';
  import IconIntel from '../../../public/assets/svg/roleIcons/radar.svg';
  import Portrait1 from '../../../public/assets/svg/portraits/portrait1.svg';
  import Portrait2 from '../../../public/assets/svg/portraits/portrait2.svg';
  import Portrait3 from '../../../public/assets/svg/portraits/portrait3.svg';
  import Portrait4 from '../../../public/assets/svg/portraits/portrait4.svg';

  export default {
    name: 'role',
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
  .role {
    font-size: 3vw;
    color: #ddd;
    text-transform: uppercase;
    background-color: #313131;
    position: relative;
    overflow: hidden;
  }
  .role.odd {
    background-color: #151515;
  }

  .role .roleText {
    z-index: 1150;
    text-align: center;
    position: absolute;
    top: .5vw;
    right: .8vw;
    width: 12vw
  }

  .role .portrait {
    position: absolute;
    left: 0vw;
    top: -.5vw;
    height: 15vw;
    width: auto;
    z-index: 1120;
  }

  .role .roleIcon {
    position: absolute;
    bottom: 1.1vw;
    height: 6vw;
    width: auto;
    right: 3.7vw;
  }

  .role > div {
    height: 100%;
  }

  .role .engineer {
    background-color: #253822;
  }

  .role .captain {
    background-color: #414225;
  }

  .role .pilot {
    background-color:#3e2323;
  }

  .role .intel {
    background-color: #2e2e40;
  }

  .role .engineer .roleIcon {
    fill: #5ea726;
  }
  .role .captain .roleIcon {
    fill: #d6b752;
    bottom: 1.3vw;
  }
  .role .pilot .roleIcon {
    fill: #e54646;
  }
  .role .intel .roleIcon {
    fill: #3c87cf;
  }

  .roleLink {
    position: absolute;
    top: 25%;
    left: 50%;
    width: 50%;
    height: 75%;
  }
</style>
