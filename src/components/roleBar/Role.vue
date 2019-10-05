<template>
  <div :class="classObj" :style="styleObj">
    <IconEngineer v-if="index === 0" class="roleIcon" :style="iconStyleObj" />
    <Portrait3 v-if="index === 0" class="portrait" />

    <IconCaptain v-if="index === 1" class="roleIcon" :style="iconStyleObj"/>
    <Portrait1 v-if="index === 1" class="portrait" />

    <IconPilot v-if="index === 2" class="roleIcon" :style="iconStyleObj" />
    <Portrait4 v-if="index === 2" class="portrait" />

    <IconIntel v-if="index === 3" class="roleIcon"  :style="iconStyleObj" />
    <portrait2 v-if="index === 3" class="portrait" />

    <span v-bind:class="{ current: index === currentRole, roleText: true }">{{ roleName }}</span>
    <button class="roleLink" v-on:click="setRole(index)"></button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { roles } from '../../definitions';
  import IconCaptain from '../../../public/assets/svg/roleIcons/medal.svg';
  import IconPilot from '../../../public/assets/svg/roleIcons/pilot.svg';
  import IconEngineer from '../../../public/assets/svg/roleIcons/wrench.svg';
  import IconIntel from '../../../public/assets/svg/roleIcons/radar.svg';
  import Portrait1 from '../../../public/assets/svg/portraits/portrait1.svg';
  import Portrait2 from '../../../public/assets/svg/portraits/portrait2.svg';
  import Portrait3 from '../../../public/assets/svg/portraits/portrait3.svg';
  import Portrait4 from '../../../public/assets/svg/portraits/portrait4.svg';
  import $g from '../../utils/globals.js';

  export default {
    name: 'role',
    components: {
      IconCaptain, IconIntel, IconEngineer, IconPilot,
      Portrait1, Portrait2, Portrait3, Portrait4
    },
    props: {
      index: Number,
    },
    methods: {
      setRole: function (role) {
        this.$store.dispatch('setCurrentRole', role);
        $g.viewport.update();
      },
    },
    computed: {
      ...mapState(['currentRole']),
      roleName() {
        return roles[this.index].name;
      },
      classObj() {
        const c = { role: true };
        c[`${roles[this.index].name}`] = true; // add 'roleName' as a class
        return c;
      },
      styleObj() {
        return {
          'background-color': `${roles[this.index].bgColor}`
        };
      },
      iconStyleObj() {
        return {
          fill: `${roles[this.index].iconColor}`
        };
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* All sizes in vw to preserve proportions across different resolutions */
  .role {
    color: #ddd;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
  }

  .role .roleText {
    z-index: 1150;
    text-align: center;
    position: absolute;
    top: 4%;
    right: 3%;
    width: 50%;
  }

  .role .roleText.current {
    text-shadow: 0 0 1vw rgba(255, 255, 255, 1);
  }

  .role .portrait {
    position: absolute;
    left: 0vw;
    top: -5%;
    height: 129%;
    width: auto;
    z-index: 1120;
  }

  .role .roleIcon {
    position: absolute;
    bottom: 11%;
    height: 50%;
    width: auto;
    right: 16%;
  }

  .role > div {
    height: 100%;
  }

  .role.engineer {
  }

  .role.captain {
  }

  .role.pilot {
  }

  .role.intel {
  }

  .role.engineer .roleIcon {
  }
  .role.captain .roleIcon {
  }
  .role.pilot .roleIcon {
  }
  .role.intel .roleIcon {
  }

  .roleLink {
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    background-color: transparent;
    border: none;
    outline: none;
    z-index: 1130;
  }
</style>
