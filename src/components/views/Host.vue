<template>
  <div id="host">
    <Logo />

    <div id="displayDiv" :class="{
      pannable: true,
      unpanned: isUnpanned,
      pannedLeft: isPanLeft,
      pannedRight: isPanRight
    }">
      <div id="identifier">
        <div class="smaller">hosting as</div>
        <div class="identifierText">24 Kicking Ants</div>
      </div>

      <Players />

      <input id="invite" placeholder="enter player code">
      <NavButton text="INVITE" />
    </div>

    <BottomLinks leftText="join" rightText="start" :leftAction="toJoin" :rightAction="toGame" />

    <BgStars />
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
    name: 'host',
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
      toJoin() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // give button time to animate b4 panning
        this.timer = setTimeout(() => {
          this.isUnpanned = false;
          this.isPanRight = true;
        }, 250);
         // now navigate away after the panning runs
        this.timer2 = setTimeout(() => {
          this.$router.push('/join');
        }, 1000); // give it time to play the animation.
      },
      toGame() {
        clearTimeout(this.timer);
        clearTimeout(this.timer2);
        // give button time to animate b4 panning
        this.timer = setTimeout(() => {
          this.isUnpanned = false;
          this.isPanLeft = true;
        }, 250);
         // now navigate away after the panning runs
        this.timer2 = setTimeout(() => {
          this.$router.push('/game');
        }, 1000); // give it time to play the animation.
      }
    },
    data: () => { // this is how you set default values
      return {
        message: '',
        identifier: '',
        socketStatus: null,
        isHost: null,
        isUnpanned: false,
        isPanRight: false,
        isPanLeft: true, // starts with panned left state
      };
    },
    computed: {
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
  #players {
    margin-top: 9%;
    margin-bottom: 9%;
  }

  #invite {
    width: 100%;
    background-color: transparent;
    border: 0.13em inset #b17200;
    color: white;
    font-size: 0.6em;
    letter-spacing: 0.04em;
    padding: 0.7em 0.6em;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    margin-bottom: 1em;
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  #invite:focus {
    background-color: rgba(0, 0, 0, 1);
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
    #host #displayDiv {
      height: 140vw;
      width: 80%;
      left: 10%;
      top: 50%;
      margin-top: -66vw;
      font-size: 8vw;
    }
    #host #logo {
      position: absolute;
      width: 50vw;
      left: 25vw;
      top: 4%;
      font-size: 5vw;
    }
    #host #logo svg {
      display: none;
    }
  }
  @media (min-width: 600px) and (orientation: portrait) {  /* tabs - portrait */
    #host #displayDiv {
      height: 60vw;
      width: 34%;
      left: 33%;
      top: 50%;
      margin-top: -29vw;
      font-size: 3.4vw;
    }
    #host #logo {
      position: absolute;
      width: 50vw;
      left: 25vw;
      top: 15%;
      font-size: 5vw;
    }
  }
  @media (min-width: 1024px) and (orientation: portrait) {  /* pcs - portrait */
    #host #displayDiv {
      height: 50vw;
      width: 30%;
      left: 35%;
      top: 50%;
      margin-top: -23vw;
      font-size: 3vw;
    }
    #host #logo {
      position: absolute;
      width: 40vw;
      left: 30vw;
      top: 19%;
      font-size: 4vw;
    }
  }
  @media (max-width: 900px) and (orientation: landscape) {  /* phones - landscape */
    #host #displayDiv {
      height: 80vh;
      width: 70vh;
      left: 50%;
      margin-left: -35vh;
      top: 50%;
      margin-top: -32vh;
      font-size: 6vh;
    }
    #host #players {
      width: 180% !important;
      margin-left: -40%;
      margin-top: 3%;
      margin-bottom: 7%;
    }
    #host #players .player {
      width: 23.5%;
      padding-top: 18%;
      margin-right: 2% !important;
      margin-bottom: 0 !important;
    }
    #host #players .player:last-child {
      margin-right: 0 !important;
    }
    #host #logo {
      position: absolute;
      width: 60vh;
      left: 50%;
      margin-left: -30vh;
      top: 4%;
      font-size: 6vh;
    }
    #host #logo > svg {
      display: none;
    }
  }
  @media (min-width: 900px) and (orientation: landscape) {  /* tabs - landscape  */
    #host #displayDiv {
      height: 60vh;
      width: 34vh;
      left: 50%;
      margin-left: -17vh;
      top: 50%;
      margin-top: -25vh;
      font-size: 3.4vh;
    }
    #host #logo {
      position: absolute;
      width: 36vh;
      left: 50%;
      margin-left: -18vh;
      top: 12%;
      font-size: 3.6vh;
    }
  }
  @media (min-width: 1366px) and (orientation: landscape) {  /* pcs - landscape  */
    #host #displayDiv {
      height: 56vh;
      width: 30vh;
      left: 50%;
      margin-left: -15vh;
      top: 50%;
      margin-top: -23vh;
      font-size: 3vh;
    }
    #host #logo {
      position: absolute;
      width: 36vh;
      left: 50%;
      margin-left: -18vh;
      top: 14%;
      font-size: 3.6vh;
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
  /* #identifier {
    position: relative;
    padding: 15px;
    color: green;
    font-size: 18px;
    font-weight: 500;
  } */
</style>
