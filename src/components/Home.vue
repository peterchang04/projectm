<template>
  <div id="testOutput">
    Home Component
    <div id="identifier">
      <span v-if="identifier">{{ identifier }}</span>
      <span v-else>loading...</span>
    </div>
    <input v-if="identifier" name="message" v-model="message" v-on:keydown="inputSubmit" placeholder="invite browser" />
  </div>
</template>

<script>
  import loader from '../utils/loader';
  console.log('env:', process.env);
  export default {
    name: 'testOutput',
    props: {
      msg: String,
    },
    beforeCreate: function() {
      loader.init((socketObj) => {
        this.identifier = socketObj.identifier;
        this.socketObj = socketObj;
      });
    },
    methods: {
      inputSubmit: function (event) {
        if (event.keyCode === 13 && this.message) {
          this.socketObj.sendOffer(this.message);
          this.message = ''; // reset the input to blank
        }
      }
    },
    data: () => { // this is how you set default values
      return {
        message: '',
        identifier: ''
      };
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #testOutput {

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
