<template>
  <div id="sliderVertical" :style="styleObj">
    <div class="margin">
      <div class="meter">
        <span class="title">{{ title }}</span>
        <span class="status">{{ status }}</span>

        <div class="meterFill"></div>
        <div class="handle"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sliderVertical',
    props: {
      title: String,
      status: String,
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 4 },
      gridRowStart: { type: Number, default: 1 },
      gridRows: { type: Number, default: 1 },
    },
    computed: {
      styleObj() {
        return {
          'grid-column-start': this.gridColumnStart,
          'grid-column-end': this.gridColumnStart + this.gridColumns,
          'grid-row-start': this.gridRowStart,
          'grid-row-end': this.gridRowStart + this.gridRows,
        };
      },
    },
    mounted: function() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #sliderVertical {
    position: relative; /* to allow for span positioning */
  }
  .margin {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 3vw;
  }

  .meter {
    position: relative;
    background-color: #000;
    height: 100%;
    width: 100%;
    border-radius: 2vw;
    box-shadow: inset 0 0 2vw #555;
  }

  .meterFill {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 50%;
    width: 100%;
    background-color: #00c4ff;
    box-shadow: 0 0 2vw rgba(53, 227, 255, 0.5);
    border-radius: 2vw;
  }

  .handle {
    position: absolute;
    top: 50%;
    left: -25%;
    height: 5vw;
    margin-top: -2.5vw;
    width: 150%;
    background-color: #ddd;
    border: 0.5vw solid #666;
    border-radius: 1.5vw;
    cursor: pointer;
    box-shadow: 0.5vw 0.5vw 1vw rgba(0, 0, 0, .5);
  }

  .title {
    position: absolute;
    z-index: 1000;
    /* font look-n-feel */
    color: white;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
    font-size: 4.5vw;
    font-weight: 800;
    line-height: 4.5vw;
    /*
      rotate happens from top left corner of text div
      we use bottom and left to position the top left of text into rotation position
      which should be the same as the rotated upper left of T
    */
    bottom: 0vw;
    left: 1.2vw;
    transform-origin: 0 0;
    transform: rotate(-90deg);
  }

  .status {
    position: absolute;
    z-index: 1000;
    /* Status text rotate is trickier than .title - give it fixed width to predict rotation */
    width: 16vw;
    text-align: right;
    /* font look-n-feel */
    color: white;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
    font-size: 4vw;
    font-weight: 600;
    line-height: 4vw;
    /*
      rotate happens from top left corner of text div
      we use bottom and left to position the top left of text into rotation position
      which should be the same as the rotated upper left of T
    */
    top: 7vw;
    left: -11vw;
    transform-origin: 12vw 0;
    transform: rotate(-90deg);
  }
</style>
