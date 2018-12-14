<template>
  <div id="testOutput">
    <div id="socketStatus" v-bind:class="socketStatusClass"></div>

    <div id="identifier">
      <span v-if="identifier">{{ identifier }}</span>
      <span v-else>loading...</span>
    </div>
    <input v-if="identifier && socketStatus == 1" name="message" v-model="message" v-on:keydown="inputSubmit" placeholder="invite browser" />

  </div>
</template>

<script>
  import state from '../state';
  import peers from '../utils/peers';

  export default {
    name: 'testOutput',
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
        socketStatus: null
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
  #testOutput {

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
