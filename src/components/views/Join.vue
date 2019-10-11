<template>
  <div id="join">
    <div id="displayDiv" :class="classObj">
      <div id="identifier">
        <div class="smaller">your code</div>
        <div class="identifierText">24 Kicking Ants</div>
      </div>

      <input id="invite" placeholder="enter host code">

      <NavButton text="Join" />
    </div>

    <Logo />
    <BgStars />
    <BottomLinks leftText="host" :leftAction="toHost" />
  </div>
</template>

<script>
  import peers from '../../utils/peers';
  import Players from '../Players.vue';
  import NavButton from '../controls/NavButton.vue';
  import BgStars from './common/BgStars.vue';
  import Logo from './common/Logo.vue';
  import BottomLinks from './common/BottomLinks.vue';

  export default {
    name: 'join',
    components: { Players, NavButton, BgStars, Logo, BottomLinks },
    props: {
      msg: String,
    },
    methods: {
      inputSubmit: function (event) {
        if (event.keyCode === 13 && this.message) {
          peers.tryAdd(this.message);
          this.message = ''; // reset the input to blank
        }
      },
      toHost() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // give button time to animate b4 panning
        this.timer = setTimeout(() => {
          this.isUnpanned = false;
          this.isPanRight = true;
        }, 250);
         // now navigate away after the panning runs
        this.timer2 = setTimeout(() => {
          this.$router.push('/host');
        }, 1000); // give it time to play the animation.
      },
    },
    data: () => { // this is how you set default values
      return {
        message: '',
        identifier: '',
        socketStatus: null,
        isHost: null,
        isUnpanned: false,
        isPanRight: true, // starts off to the right
        isPanLeft: false,
      };
    },
    computed: {
      classObj() {
        return {
          pannable: true,
          unpanned: this.isUnpanned,
          pannedLeft: this.isPanLeft,
          pannedRight: this.isPanRight,
        };
      },
      socketStatusClass: function() {
        return {
          connected: this.socketStatus === 1,
          reconnecting: this.socketStatus === -1,
          failed: this.socketStatus === -2
        };
      },
      socketStatusTitle: function() {
        if (this.socketStatus === 1) return 'Socket.io connected';
        if (this.socketStatus === -1) return 'Socket.io not connn'
      }
    },
    mounted() {
      this.isUnpanned = true;
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #identifier {
    width: 100%;
    margin-bottom: 7%;
  }
  #identifier .identifierText {
    font-size: 1em;
    color: white;
    letter-spacing: 0.04em;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
  #identifier .smaller {
    font-size: 0.7em;
    opacity: .4;
    color: white;
    text-shadow: 0 0 0.2em rgba(255, 255, 255, .5);
  }
  #invite {
    width: 100%;
    background-color: transparent;
    border: 0.13em solid rgba(255, 255, 255, .5);
    color: white;
    font-size: 0.6em;
    letter-spacing: 0.04em;
    padding: 0.7em 0.6em;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 0.5em;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  #invite:focus {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 0.3em rgba(255, 255, 255, 0.3);
    outline: none;
  }

  ::placeholder {
    color: #444;
    text-transform: none;
    opacity: 1;
  }

  @media (max-width: 599px) and (orientation: portrait) {  /* phones - portrait */
    #join #displayDiv {
      height: 70vw;
      width: 80%;
      left: 10%;
      top: 50%;
      margin-top: -35vw;
      font-size: 8vw;
    }
    #join #logo {
      position: absolute;
      width: 80vw;
      left: 10vw;
      top: 15%;
      font-size: 8vw; /* 1/10 of width to maintain font ratio */
    }
  }
  @media (min-width: 600px) and (orientation: portrait) {  /* tabs - portrait */
    #join #displayDiv {
      height: 30vw;
      width: 34%;
      left: 33%;
      top: 50%;
      margin-top: -18vw;
      font-size: 3.4vw;
    }
    #join #logo {
      position: absolute;
      width: 50vw;
      left: 25vw;
      top: 21%;
      font-size: 5vw;
    }
  }
  @media (min-width: 1024px) and (orientation: portrait) {  /* pcs - portrait */
    #join #displayDiv {
      height: 25vw;
      width: 30%;
      left: 35%;
      top: 50%;
      margin-top: -18vw;
      font-size: 3vw;
    }
    #join #logo {
      position: absolute;
      width: 40vw;
      left: 30vw;
      top: 23%;
      font-size: 4vw;
    }
  }
  @media (max-width: 900px) and (orientation: landscape) {  /* phones - landscape */
    #join #displayDiv {
      height: 70vh;
      width: 80vh;
      left: 50%;
      margin-left: -40vh;
      top: 50%;
      margin-top: -23vh;
      font-size: 8vh;
    }
    #join #logo {
      position: absolute;
      width: 80vh;
      left: 50%;
      margin-left: -40vh;
      top: 8%;
      font-size: 8vh;
    }
    #join #logo > svg {
      display: none;
    }
  }
  @media (min-width: 900px) and (orientation: landscape) {  /* tabs - landscape  */
    #join #displayDiv {
      height: 30vh;
      width: 34vh;
      left: 50%;
      margin-left: -17vh;
      top: 50%;
      margin-top: -14vw;
      font-size: 3.4vh;
    }
    #join #logo {
      position: absolute;
      width: 36vh;
      left: 50%;
      margin-left: -18vh;
      top: 16%;
      font-size: 3.6vh;
    }
  }
  @media (min-width: 1366px) and (orientation: landscape) {  /* pcs - landscape  */
    #join #displayDiv {
      height: 25vh;
      width: 30vh;
      left: 50%;
      margin-left: -15vh;
      top: 50%;
      margin-top: -9vw;
      font-size: 3vh;
    }
    #join #logo {
      position: absolute;
      width: 40vh;
      left: 50%;
      margin-left: -20vh;
      top: 20%;
      font-size: 4vh;
    }
  }

  #socketStatus {
    position: absolute;
    top: 8px;
    left: 8px;
    border-radius: 10px;
    height: 10px;
    width: 10px;
  }
  #socketStatus.connected {
    background-color: green;
  }
  #socketStatus.reconnecting {
    background-color: orange;
  }
  #socketStatus.failed {
    background-color: red;
  }

  input[name=message] {
    display: block;
    width: 100px;
    margin: auto;
    padding: 5px 10px;
  }
</style>
