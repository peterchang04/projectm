<template>
  <div id="logo">
    <MyShipSVG id="myShipSVG" />
    <span class="logoText">Starship</span>
    <span class="logoSubtext">Frontier</span>
    <span class="logoSubtextGlow">Frontier</span>

    <div class="stripe">
      <div class="triangleLeft"></div>
      <div class="triangleRight"></div>
    </div>
    <div class="stripe two">
      <div class="triangleLeft"></div>
      <div class="triangleRight"></div>
    </div>
  </div>
</template>

<script>
  import TargetsBar from '../../targetBar/TargetsBar.vue';
  import MyShipSVG from '../../../../public/assets/svg/ships/myShip.svg';

  export default {
    name: 'logo',
    components: { MyShipSVG },
    props: {
      msg: String
    },
    methods: {
    },
    mounted() {
    },
  };
</script>

<style>
  #logo {
    font-family: 'Raleway';
    font-weight: 800;
    text-transform: uppercase;
    height: 2em;
    position: relative;
  }
  #myShipSVG {
    position: absolute;
    top: -82%;
    left: 50%;
    margin-left: -2em;
    width: 4em;
    height: 4em;
    z-index: 1;
  }
  span.logoText {
    color: white;
    position: absolute;
    top: 0;
    width: 100%;
    font-size: 1.3em;
    line-height: 0.95em;
    text-shadow: 0 0 0.2em rgba(0, 0, 0, 0.8);
    z-index: 1;
    display: block;
  }
  span.logoSubtext {
    position: absolute;
    top: 49%;
    width: 100%;
    font-size: 0.8em;
    font-style: italic;
    color: #07d1ff;
    letter-spacing: 0.03em;
    z-index: 3;
    display: block;
    transform: scaleY(0.7);
    text-shadow: 0 0 0.4em rgba(0, 0, 0, 0.8);
  }
  span.logoSubtextGlow {
    position: absolute;
    top: 49%;
    width: 100%;
    color: transparent;
    font-size: 0.8em;
    font-style: italic;
    color: #07d1ff;
    letter-spacing: 0.03em;
    text-shadow: 0 0 0.4em rgba(74, 217, 255, 0.8);
    animation: throbText 0.5s 0.5s infinite;
    z-index: 2;
    display: block;
    transform: scaleY(0.7);
  }
  .stripe {
    width: 100%;
    height: 20%;
    position: absolute;
    top: 13%;
    z-index: 0;
    background-color: #ff4d00;
    filter: blur(0.02em);
  }
  .stripe.two {
    top: 39%;
    height: 10%;
    width: 80%;
    background-color: #7952ff;
    left: 10%;
  }
  .triangleLeft {
    z-index: 0;
    width: 0;
    height: 0;
    left: 0;
    position: absolute;
    top: 0;
    border-left: 0.45em solid #131315;
    border-top: 0.45em solid transparent;
  }
  .triangleRight {
    z-index: 0;
    width: 0;
    height: 0;
    right: 0;
    position: absolute;
    top: 0;
    border-right: 0.45em solid #131315;
    border-top: 0.45em solid transparent;
  }
  @keyframes throbText {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
</style>
