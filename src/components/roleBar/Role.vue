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
  import def from '../../definitions';
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
      index: Number,
    },
    methods: {
      setRole: function (role) {
        this.$store.dispatch('setCurrentRole', role);
      },
    },
    computed: {
      currentRole() {
        return this.$store.state.currentRole;
      },
      roleName() {
        return def.roles[this.index].name;
      },
      classObj() {
        const c = { role: true };
        c[`${def.roles[this.index].name}`] = true; // add 'roleName' as a class
        return c;
      },
      styleObj() {
        return {
          'background-color': `${def.roles[this.index].bgColor}`
        };
      },
      iconStyleObj() {
        return {
          fill: `${def.roles[this.index].iconColor}`
        };
      }
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* All sizes in vw to preserve proportions across different resolutions */
  .role {
    font-size: 3vw;
    color: #ddd;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
  }

  .role .roleText {
    z-index: 1150;
    text-align: center;
    position: absolute;
    top: .5vw;
    right: .8vw;
    width: 12vw
  }

  .role .roleText.current {
    text-shadow: 0 0 1vw rgba(255, 255, 255, 1);
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
    bottom: 1.3vw;
  }
  .role.pilot .roleIcon {
  }
  .role.intel .roleIcon {
  }

  .roleLink {
    position: absolute;
    top: 10%;
    left: 50%;
    width: 50%;
    height: 90%;
    background-color: transparent;
    border: none;
    outline: none;
  }
</style>
