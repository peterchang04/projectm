<template>
  <div class="slider">

    <div class="progressBar">
      <div class="progressBarFillWrapper">
        <div class="progressBarFill"></div>
      </div>

      <span class="title">{{ title }}</span>
    </div>

    <div class="leverGroove">
      <div class="leverHandle"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'slider',
    props: {
      title: { type: String, default: 'Something' },
      progress: { type: Number, default: 0 },
      width: { type: Number, default: 20 }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slider {
    display: inline-block;
  }
  .slider .progressBar {
    width: 35vw;
    height: 7vw;
    background-color: #222;
    text-transform: uppercase;
    position: relative;
  }
  .slider .progressBarFillWrapper {
    padding: .65vw;
    position: relative;
    height: 100%;
  }
  .slider .progressBarFill {
    background-color: #0ACCFC;
    width: 75%;
    height: 100%;
    box-shadow: 0 0 2vh rgba(10, 204, 252, .3);
  }
  .slider .title {
    position: absolute;
    color: white;
    line-height: 7vw;
    width: 100%;
    font-size: 4vw;
    text-align: center;
    left: 0;
    top: 0;
  }
  .slider .leverGroove {
    height: 2vw;
    background-color: #151515;
    border: .4vw solid #222;
    position: relative;
  }
  .slider .leverHandle {
    height: 8vw;
    width: 3vw;
    border-radius: .9vw;
    background-color: #AAA;
    position: absolute;
    left: 0%;
    top: 0;
    margin-left: -1.3vw;
    margin-top: -5.5vw;
    box-shadow: 0 0 2vw rgba(0, 0, 0, .5);
  }
</style>
