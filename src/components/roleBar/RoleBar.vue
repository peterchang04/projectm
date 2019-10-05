<template>
  <div id="roleBar">
    <Role :index="0" />
    <Role :index="1" />
    <Role :index="2" />
    <Role :index="3" />
  </div>
</template>

<script>
  import { roles } from '../../definitions';
  import Role from './Role.vue';

  export default {
    name: 'roleBar',
    components: { Role },
    props: {
      msg: String,
    },
    computed: {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #roleBar {
    position: absolute;
    z-index: 1100;
    box-shadow: 0 0 0.7em rgba(0, 0, 0, 0.8);
  }
  .role {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 25%;
    /* relative height hack - instead of 100% use half of width as padding */
    padding-top: 12.5%;
  }

  #roleBar.stackLayout .role {
    width: 50%;
    padding-top: 25%;
  }

  #roleBar.fullLayout {
    width: 50%;
    left: 50%;
    margin-left: -25%;
    bottom: 0;
  }

  #roleBar.rowLayout .role {
    width: 25%;
    padding-top: 12.5%;
  }


  .pc-portrait #roleBar.stackLayout, .tablet-portrait #roleBar.stackLayout {
    width: 34vw;
    left: 33vw;
  }
  .pc-portrait #roleBar.stackLayout .role, .tablet-portrait #roleBar.stackLayout .role {
    font-size: 2.1vw;
  }

  .pc-landscape #roleBar.fullLayout {
    width: 50vh;
    left: 50%;
    margin-left: -25vh;
  }
  .pc-landscape #roleBar.fullLayout .role {
    font-size: 1.6vh;
  }

  /* font-size control */
  .phone-landscape .fullLayout .role {
    font-size: 1.6vw;
  }
  .tablet-portrait .fullLayout .role {
    font-size: 1.6vw;
  }
  .tablet-portrait .stackLayout .role {
    font-size: 2.1vw;
  }
  .tablet-landscape .fullLayout .role {
    font-size: 2.1vh;
  }

</style>
