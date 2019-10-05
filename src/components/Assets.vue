<!-- preload all SVG into vue components here using svg-to-vue-component for rendering on canvas -->
<template>
  <div id="assets" :class="{ showAssets }">
    <MyShipSVG id="MyShipSVG" :onload="reportLoaded()"  />
    <AsteroidSVG id="AsteroidSVG" :onload="reportLoaded()" />
    <TurretSVG id="TurretSVG" height="100" width="100" :onload="reportLoaded()" />
    <TorpedoSVG id="TorpedoSVG" height="100" width="100" :onload="reportLoaded()" />
  </div>
</template>

<script>
  import canvasSvg from '../utils/canvasSvg.js';
  import compositeSvg from '../utils/compositeSvg.js';
  import MyShipSVG from '../../public/assets/svg/ships/myShip.svg';
  import AsteroidSVG from '../../public/assets/svg/asteroids/asteroid.svg';
  import TurretSVG from '../../public/assets/svg/ships/turret.svg';
  import TorpedoSVG from '../../public/assets/svg/torpedos/torpedo.svg';
  import $g from '../utils/globals.js';

  let loadedCount = 0;
  export default {
    components: {
      MyShipSVG,
      AsteroidSVG,
      TurretSVG,
      TorpedoSVG
    },
    computed: {
      showAssets() {
        return $g.constants.SHOWASSETS;
      }
    },
    data() {
      return {
        expectCount: 0,
        loadedCount: 0,
      };
    },
    methods: {
      reportLoaded() {
        loadedCount++;
        if (loadedCount === this.expectCount) {
          canvasSvg.init();
          compositeSvg.init();
        }
      }
    },
    mounted: function (){
      this.expectCount = this.$children.length + 1; // plus 1 for mounted event
      this.reportLoaded();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #assets {
    position: fixed;
    height: 100%;
    width: 100%;
    top: -1000px;
    left: -1000px;
    z-index: 9999;
    text-align: left;
    pointer-events: none;
  }
  #assets.showAssets {
    top: 0;
    left: 0;
  }
  #assets svg {
    height:50px;
    width:50px;
  }
  #assets > div {
    background-color: #070707;
  }
  #assets > div:nth-child(3n+1) {
    background-color: #111111;
  }
  #assets > div:nth-child(3n+2) {
    background-color:black;
  }

</style>
