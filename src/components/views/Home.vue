<template>
  <div id="home">
    <div id="buttonsDiv">
      <router-link to="/host">
        <Button text="HOST" />
      </router-link>

      <hr />

      <div id="or">or</div>

      <router-link id="join" to="/join">
        <Button text="JOIN" />
      </router-link>
    </div>
  </div>
</template>

<script>
  import Button from '../controls/Button.vue';

  export default {
    name: 'home',
    components: { Button },
  };
  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #buttonsDiv{
    position: absolute;
    height: 60vw;
    width: 100%;
    top: 50%;
    margin-top: -30vw;
  }
  #or {
    position: absolute;
    width: 10%;
    left: 45%;
    background-color: #0c171f;
    top: 50%;
    margin-top: -3%;
  }
  #join {
    position: absolute;
    top: 70%;
    left: 8.5%;
  }
  hr {
    position: absolute;
    width: 60%;
    border-width: .2vw;
    opacity: .3;
    left: 20%;
    top: 50%;
    margin-top: -2px;
  }
</style>
