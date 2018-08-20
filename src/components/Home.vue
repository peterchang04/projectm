<template>
  <div id="testOutput">
    Home Component
    <input name="message" v-model="message" v-on:keydown="inputSubmit" />
  </div>
</template>

<script>
  // import { init } from '../rtc';
  // init();
  import socket from '../utils/socketio';

  export default {
    name: 'testOutput',
    props: {
      msg: String,
    },
    methods: {
      inputSubmit: function (event) {
        if (event.keyCode === 13) {
          socket.send('test', this.message);
          this.message = '';
        }
      }
    },
    data: () => {
      return {
        message: '',
      };
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testOutput {

  }
  input[name=message] {
    display: block;
    width: 100px;
    margin: auto;
    padding: 5px 10px;
  }
</style>
