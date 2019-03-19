<template>
  <div id="assets">
    <MyShipSVG id="MyShipSVG" />
    <MyShipSVG id="MyShipSVG2" />
    <MyShipSVG id="MyShipSVG3" />
    <MyShipSVG id="MyShipSVG4" />
    <MyShipSVG id="MyShipSVG5" />
    <MyShipSVG id="MyShipSVG6" />
    <MyShipSVG id="MyShipSVG7" />
    <MyShipSVG id="MyShipSVG8" />
    <MyShipSVG id="MyShipSVG9" />
    <MyShipSVG id="MyShipSVG10" />
    <MyShipSVG id="MyShipSVG11" />
    <MyShipSVG id="MyShipSVG12" />
  </div>
</template>

<script>
  import canvasSvg from '../utils/canvasSvg.js';
  import canvasText from '../utils/canvasText.js';
  import MyShipSVG from '../assets/svg/myShip.svg';


  export default {
    components: {
      MyShipSVG
    },
    props: {
      // msg: String
    },
    mounted: function (){
      // processes all the assets
      canvasSvg.init();
      // creates an in-memory canvas to prerender letters and numbers for performance
      canvasText.init();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #assets {
    position: fixed;
    height: 100%;
    width: 100%;
    top: -500px;
    left: 0px;
    z-index: 9999;
    text-align: left;
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
