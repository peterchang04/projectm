<template>
  <div id="roleBar" class="proportionateHeightWrapper">
    <div class="content">
      <Role :index="0" />
      <Role :index="1" />
      <Role :index="2" />
      <Role :index="3" />
    </div>

    <div class="roleBarOutline left" :style="roleBarOutlineStyleLeftObj"></div>
    <div class="roleBarOutline right" :style="roleBarOutlineStyleRightObj"></div>
  </div>
</template>

<script>
  import { roles } from '../../definitions';
  import { mapState } from 'vuex';
  import Role from './Role.vue';

  export default {
    name: 'roleBar',
    components: { Role },
    props: {
      msg: String
    },
    computed: {
      ...mapState(['currentRole']),
      roleBarOutlineStyleLeftObj() {
        if (this.currentRole === null) return {};
        return {
          left: 0,
          width: `${this.currentRole * 25}%`,
          'background-color': roles[this.currentRole].bgColor,
        };
      },
      roleBarOutlineStyleRightObj() {
        if (this.currentRole === null) return {};
        return {
          left: `${(this.currentRole * 25) + 25}%`,
          width: `${75 - (this.currentRole * 25)}%`,
          'background-color': roles[this.currentRole].bgColor,
        };
      },
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* START This allows even height / width ratios across viewports */
  .proportionateHeightWrapper { position: relative; width: 100%; }
  .proportionateHeightWrapper:before{ content: ""; display: block;
  	padding-top: 12%; /* HEIGHT PROPORTION */
  }
  .proportionateHeightWrapper .content {
    position: absolute; top: 0; left: 0; bottom: 0; right: 0;
  }
  /* END This allows for proportionate height / width ratio across viewports */
  .content {
    z-index: 1100;
    position: relative;
  }

  .content .role {
    display: inline-block;
    vertical-align: top;
    width: 25%;
    height: 100%;
  }

  .roleBarOutline {
    position: absolute;
    width: 0;
    bottom: 0;
    left: 0;
    background-color: red;
    height: .6vw;
    z-index: 1100;
  }


</style>
