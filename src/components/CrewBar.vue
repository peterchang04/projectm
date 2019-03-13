<template>
  <div id="crewBar" class="proportionateHeightWrapper">
    <div class="content">
      <CrewMember role="engineer" :index="0" />
      <CrewMember role="captain" :index="1" />
      <CrewMember role="pilot" :index="2" />
      <CrewMember role="intel" :index="3" />
    </div>
  </div>
</template>

<script>
  import CrewMember from './CrewMember.vue';

  export default {
    name: 'crewBar',
    components: { CrewMember },
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

  .content .crewMember {
    display: inline-block;
    vertical-align: top;
    width: 25%;
    height: 100%;
  }
  .member:nth-child(even) {
    background-color: #444;
  }

</style>
