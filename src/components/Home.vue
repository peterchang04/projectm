<template>
  <div>
    <div id="identifierDiv">
      <div class="smaller">hosting as</div>
      <div class="identifierText">24 Kicking Ants</div>
    </div>
    <div id="players">

    </div>
    <div id="players">

    </div>
    <div id="players">

    </div>
    <div id="players">

    </div>

    <div id="invite">
      <input placeholder="enter invite code">
      <button>INVITE</button>
    </div>
    <div id="links">
      <button>join</button>
      <button>start</button>
      </div>
    </div>
  </div>
</template>

<script>
  import state from '../state';
  import peers from '../utils/peers';

  export default {
    name: 'home',
    props: {
      msg: String,
    },
    beforeCreate: function() {
      state.onChange('identifier', (value) => { // set identifier when it gets loaded
        this.identifier = value;
      });
      state.onChange('socketStatus', (value) => {
        this.socketStatus = value;
      });
      state.onChange('isHost', (value) => {
        this.isHost = value;
      });
    },
    methods: {
      inputSubmit: function (event) {
        if (event.keyCode === 13 && this.message) {
          peers.tryAdd(this.message);
          // state.get('socket').checkPeer(this.message); // kicks off the connection process
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
  #players {
    display: inline-block;
    width: 38vw;
    height: 38vw;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    margin: 3.5vw;
  }
  #invite input, #invite button {
    display: inline-block;
    width: 83vw;
    background-color: transparent;
    border: 0.5vw solid rgba(255, 255, 255, .5);
    color: white;
    font-size: 5vw;
    padding: 5vw;
    margin-bottom: 2vw;
  }
  #invite input {
    margin: 3.5vw;
    height: 14vw;
  }
  #invite button {
    border-radius: 2vw;
    margin: 3.5vw;
    height: 21vw;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
  }
  #identifierDiv .identifierText {
    font-size: 8vw;
    color: white;
    letter-spacing: .2vw;
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
    margin-bottom: 8vw;
  }
  #identifierDiv .smaller {
    display: inline-block;
    font-size: 5vw;
    opacity: .4;
    color: white;
    text-shadow: 0 0 2vw rgba(255, 255, 255, .5);
    margin-top: 20vw;
  }
  #links {
    font-size: 5.5vw;
  }
  #links button {
    margin: 3.5vw;
    height: 1vw;
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
