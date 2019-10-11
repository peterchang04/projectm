<template>
  <div id="home">
    <Logo />

    <div id="displayDiv" :class="{ pannable: true, pannedRight: isPanRight, pannedLeft: isPanLeft }">

      <NavButton id="host" text="HOST" v-on:touchend.native="toHost" v-on:mouseup.native="toHost" />

      <div id="divider">
        <hr />
        <span>or</span>
        <hr />
      </div>

      <NavButton id="join" text="JOIN" :color="'grey'" v-on:touchend.native="toJoin" v-on:mouseup.native="toJoin" />

    </div>
    <BgStars />
  </div>
</template>

<script>
  import NavButton from '../controls/NavButton.vue';
  import Logo from './common/Logo.vue';
  import BgStars from './common/BgStars.vue';

  export default {
    name: 'home',
    components: { NavButton, Logo, BgStars },
    data() {
      return {
        isPanRight: false,
        isPanLeft: false,
      };
    },
    methods: {
      toHost() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // give button time to animate b4 panning
        this.timer = setTimeout(() => {
          this.isPanRight = true;
        }, 250);
         // now navigate away after the panning runs
        this.timer2 = setTimeout(() => {
          this.$router.push('/host');
        }, 1000); // give it time to play the animation.
      },
      toJoin() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // give button time to animate b4 panning
        this.timer = setTimeout(() => {
          this.isPanLeft = true;
        }, 250);
         // now navigate away after the panning runs
        this.timer2 = setTimeout(() => {
          this.$router.push('/join');
        }, 1000); // give it time to play the animation.
      }
    }
  };
  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #divider {
    position: absolute;
    height: 10%;
    margin-top: -5%;
    top: 50%;
    width: 100%;
    text-align: center;
  }
  #divider hr {
    width: 42%;
    position: absolute;
    top: 50%;
    border-color: rgba(255, 255, 255, .2);
  }
  #divider hr:first-child {
    left: 0;
  }
  #divider hr:last-child {
    right: 0;
  }
  #divider span {
    font-size: .6em;
    line-height: 1.6em;
    color: rgba(255, 255, 255, .2);
    font-family: 'Raleway', Arial, sans-serif;
  }
  #home #host, #home #join {
    position: absolute;
    left: 0;
    width: 100%;
  }
  #home #host {
    top: 0;
  }
  #home #join {
    bottom: 0;
  }

  @media (max-width: 599px) and (orientation: portrait) {  /* phones - portrait */
    #home #displayDiv {
      height: 60vw;
      width: 80%;
      left: 10%;
      top: 50%;
      margin-top: -29vw;
      font-size: 8vw;
    }
    #home #logo {
      position: absolute;
      width: 80vw;
      left: 10vw;
      top: 15%;
      font-size: 8vw; /* 1/10 of width to maintain font ratio */
    }
  }
  @media (min-width: 600px) and (orientation: portrait) {  /* tabs - portrait */
    #home #displayDiv {
      height: 30vw;
      width: 34%;
      left: 33%;
      top: 50%;
      margin-top: -15vw;
      font-size: 3.4vw;
    }
    #home #logo {
      position: absolute;
      width: 50vw;
      left: 25vw;
      top: 21%;
      font-size: 5vw;
    }
  }
  @media (min-width: 1024px) and (orientation: portrait) {  /* pcs - portrait */
    #home #displayDiv {
      height: 25vw;
      width: 30%;
      left: 35%;
      top: 50%;
      margin-top: -15vw;
      font-size: 3vw;
    }
    #home #logo {
      position: absolute;
      width: 40vw;
      left: 30vw;
      top: 20%;
      font-size: 4vw;
    }
  }
  @media (max-width: 900px) and (orientation: landscape) {  /* phones - landscape */
    #home #displayDiv {
      height: 56vh;
      width: 70vh;
      left: 50%;
      margin-left: -35vh;
      top: 50%;
      margin-top: -21vh;
      font-size: 5.6vh;
    }
    #home #logo {
      position: absolute;
      width: 80vh;
      left: 50%;
      margin-left: -40vh;
      top: 8%;
      font-size: 8vh;
    }
    #home #logo > svg {
      display: none;
    }
  }
  @media (min-width: 900px) and (orientation: landscape) {  /* tabs - landscape  */
    #home #displayDiv {
      height: 30vh;
      width: 34vh;
      left: 50%;
      margin-left: -17vh;
      top: 50%;
      margin-top: -11vh;
      font-size: 3.4vh;
    }
    #home #logo {
      position: absolute;
      width: 36vh;
      left: 50%;
      margin-left: -18vh;
      top: 16%;
      font-size: 3.6vh;
    }
  }
  @media (min-width: 1366px) and (orientation: landscape) {  /* pcs - landscape  */
    #home #displayDiv {
      height: 25vh;
      width: 30vh;
      left: 50%;
      margin-left: -15vh;
      top: 50%;
      margin-top: -12vh;
      font-size: 3vh;
    }
    #home #logo {
      position: absolute;
      width: 40vh;
      left: 50%;
      margin-left: -20vh;
      top: 20%;
      font-size: 4vh;
    }
  }
</style>
