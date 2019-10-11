<template>
  <div id="links" :class="classObj">
    <button class="leftButton" v-if="leftText" v-on:touchend="triggerLeftAction" v-on:mouseup="triggerLeftAction">
      <div class="caret"></div>
      {{ leftText }}
    </button>

    <button class="rightButton" v-if="rightText" v-on:touchend="triggerRightAction" v-on:mouseup="triggerRightAction">
      {{ rightText }}
      <div class="caret"></div>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'bottomLinks',
    components: {},
    props: {
      leftText: String,
      rightText: String,
      leftAction: Function,
      rightAction: Function,
    },
    data() {
      return {
        isPannedOut: true, // starts out of screen
      };
    },
    computed: {
      classObj() {
        return {
          pannable: true,
          pannedOut: this.isPannedOut,
        };
      }
    },
    methods: {
      triggerLeftAction(e) {
        if (this.leftAction) {
          this.leftAction(e);
          this.isPannedOut = true;
        }
      },
      triggerRightAction(e) {
        if (this.rightAction) {
          this.rightAction(e);
          this.isPannedOut = true;
        }
      }
    },
    mounted() {
      this.isPannedOut = false; // animate the links in
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #links {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transform: translate3d(0, 0, 0);
  }
  #links .caret {
    border-top: 0.25em solid transparent;
    border-bottom: 0.25em solid transparent;
    display: inline-block;
    vertical-align: top;
    margin-top: 0.34em;
  }
  #links .leftButton .caret {
    border-right: 0.3em solid white;
    margin-right: 0.5em;
  }
  #links .rightButton .caret {
    border-left: 0.3em solid white;
    margin-left: 0.5em;
  }
  #links button, #links button:focus {
    outline: none;
    opacity: .3;
    background: transparent;
    color: white;
    text-decoration: none;
    padding: 0.6em 0.8em;
    font-size: 1em;
    transition: text-shadow 0.3s, opacity 0.3s;
    border: none;
    font-family: 'Fira Sans Extra Condensed';
    text-transform: uppercase;
    padding: 0.5em 0.8em;
  }
  #links .leftButton {
    float: left;
  }
  #links .rightButton {
    float: right;
  }
  #links button:hover {
    text-shadow: 0 0 0.5em rgba(255, 255, 255, 0.4);
    opacity: 0.4;
  }
  #links button:active {
    opacity: 1;
    text-shadow: 0 0 0.5em rgba(255, 255, 255, 1);
  }
  #links.pannedOut {
    transform: translate3d(0, 20vw, 0);
    opacity: 0.2;
  }
  @media (max-width: 599px) and (orientation: portrait) {  /* phones - portrait */
    #links {
      font-size: 5.5vw;
    }
  }
  @media (min-width: 600px) and (orientation: portrait) {  /* tabs - portrait */
    #links {
      font-size: 3vw;
    }
  }
  @media (min-width: 1024px) and (orientation: portrait) {  /* pcs - portrait */
    #links {
      font-size: 2.8vw;
    }
  }
  @media (max-width: 900px) and (orientation: landscape) {  /* phones - landscape */
    #links {
      font-size: 5.5vh;
    }
  }
  @media (min-width: 900px) and (orientation: landscape) {  /* tabs - landscape  */
    #links {
      font-size: 3vh;
    }
  }
  @media (min-width: 1366px) and (orientation: landscape) {  /* pcs - landscape  */
    #links {
      font-size: 2.8vh;
    }
  }
</style>
