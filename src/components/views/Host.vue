<template>
  <div id="host">
    <div id="identifierDiv">
      <div class="smaller">hosting as</div>
      <div class="identifierText">24 Kicking Ants</div>
    </div>

    <Players />

    <div id="invite">
      <input placeholder="enter invite code">
      <Button text="INVITE" />
    </div>

    <div id="links">
      <router-link id="left" to="/join">&lt;&nbsp;&nbsp;join</router-link>
      <router-link id="right" to="/game">start&nbsp;&nbsp;&gt;</router-link>
    </div>
  </div>
</template>

<script>
  import peers from '../../utils/peers';
  import Players from '../Players.vue';
  import Button from '../controls/Button.vue';

  export default {
    name: 'host',
    components: { Players, Button },
    props: {
      msg: String,
    },

    methods: {
      inputSubmit: function (event) {
        if (event.keyCode === 13 && this.message) {
          peers.tryAdd(this.message);
          this.message = ''; // reset the input to blank
        }
      }
    },
    data: () => { // this is how you set default values
      return {
        message: '',
        identifier: '',
        socketStatus: null,
        isHost: null,
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #host {
    position: absolute;
    height: 160vw;
    top: 50%;
    margin-top: -80%;
  }
  #invite input {
    display: inline-block;
    height: 12vw;
    width: 83vw;
    background-color: transparent;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    color: white;
    font-size: 5vw;
    margin: 3.5vw;
    padding: 5vw;
    margin-bottom: 2vw;
  }
  #identifierDiv {
    padding: 3vw 2.5vw;
  }
  #identifierDiv .identifierText {
    font-size: 8vw;
    color: white;
    letter-spacing: .2vw;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
  #identifierDiv .smaller {
    display: inline-block;
    font-size: 5vw;
    opacity: .4;
    color: white;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
  #links {
    font-size: 4.5vw;
    bottom: 0;
  }
  #left {
    position: fixed;
    bottom: 4vw;
    left: 4vw;
    opacity: .4;
    text-decoration: none;
  }
  #right {
    position: fixed;
    bottom: 4vw;
    right: 4vw;
    opacity: .4;
    text-decoration: none;
  }
  #left:visited {
    opacity: .4;
    color: white;
  }
  #right:visited {
    opacity: .4;
    color: white;
  }
  hr {
    border: 1px solid #ddd;
  }
  #hr-or {
    height: 20px;
    margin: -18px auto 20px auto;
    width: 41px;
    background-color: #fff;
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
  #identifier {
    position: relative;
    padding: 15px;
    color: green;
    font-size: 18px;
    font-weight: 500;
  }
  input[name=message] {
    display: block;
    width: 100px;
    margin: auto;
    padding: 5px 10px;
  }
</style>
