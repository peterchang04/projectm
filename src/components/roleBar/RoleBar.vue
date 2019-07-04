<template>
  <div id="roleBar" class="proportionateHeightWrapper">
    <div class="content">
      <Role role="engineer" :index="0" />
      <Role role="captain" :index="1" />
      <Role role="pilot" :index="2" />
      <Role role="intel" :index="3" />
    </div>
  </div>
</template>

<script>
  import Role from './Role.vue';

  export default {
    name: 'roleBar',
    components: { Role },
    props: {
      msg: String
    }
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

</style>
