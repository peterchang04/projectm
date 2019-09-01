<template>
  <div id="sliderVertical" :style="mainStyle">
    <div class="margin">
      <div class="meter">
        <span class="title">{{ title }}</span>
        <span class="status">{{ status || statusFunction(value) }}</span>

        <div class="meterFill" :style="meterFillStyle"></div>
        <div class="meterDeadZone" :style="meterDeadZoneStyle"><div class="redLine"></div></div>
        <div class="meterFillNegative" :style="meterFillNegativeStyle"></div>

        <div class="handle" :style="handleStyle"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';

  const temp = {};

  export default {
    name: 'sliderVertical',
    props: {
      title: String,
      status: String,
      initialValue: { type: Number, default: 0 },
      statusFunction: { type: Function, default: (value) => {} }, // displays status text based on
      maxValue: { type: Number, default: 100 },
      minValue: { type: Number, default: -30 },
      deadZone: { type: Number, default: 10 }, // units like value
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 4 },
      gridRowStart: { type: Number, default: 1 },
      gridRows: { type: Number, default: 1 },
    },
    data() {
      return {
        active: false, // whether or not lever being manipulated
        position: 0, // value from 0 - 100 for handle position
        value: 0, // the actual output value to systems. Not handle position
        // derived after mounted
        minY: -1, // minimum Y position of meter on screen
        maxY: -1, // maximum Y position of meter on screen
        height: -1, // height of meter
      }
    },
    computed: {
      valueSpread() {
        return this.maxValue + this.deadZone - this.minValue;
      },
      mainStyle() {
        return {
          'grid-column-start': this.gridColumnStart,
          'grid-column-end': this.gridColumnStart + this.gridColumns,
          'grid-row-start': this.gridRowStart,
          'grid-row-end': this.gridRowStart + this.gridRows,
        };
      },
      meterFillStyle() {
        return {
          height: `${(this.value * 100 / this.valueSpread) }%`,
          bottom: `${((Math.abs(this.minValue) + this.deadZone) * 100 / this.valueSpread)}%`,
          'border-bottom-left-radius': (this.minValue < 0) ? '0' : '2vw',
          'border-bottom-right-radius': (this.minValue < 0) ? '0' : '2vw',
        };
      },
      meterFillNegativeStyle() {
        return {
          height: (this.value >= 0) ? 0 : `${Math.abs(this.value) * 100 / this.valueSpread}%`,
          top: `${100 - (Math.abs(this.minValue) * 100 / this.valueSpread)}%`,
        };
      },
      meterDeadZoneStyle() {
        return {
          height: `${this.deadZone * 100 / this.valueSpread}%`,
          top: `${100 - (Math.abs(this.minValue - this.deadZone) * 100 / this.valueSpread)}%`,
        };
      },
      handleStyle() {
        return {
          bottom: `${this.position}%`,
          opacity: (this.active) ? 0.7 : 1, // see through when being dragged
        }
      }
    },
    methods: {
      getValueByPosition(position, minValue, maxValue, deadZone) {
        temp.valueSpread = maxValue + deadZone - minValue;
        temp.value = Math.round(temp.valueSpread * (position / 100)) + minValue;
        // from 0 -> deadZone is all Zero
        if (temp.value > 0 && temp.value < deadZone) {
          temp.value = 0;
        }
        if (temp.value > 0) {
          temp.value -= deadZone;
        }
        return temp.value;
      },
      snapToDeadzone(value, minValue, maxValue, deadZone) {
        temp.valueSpread = maxValue + deadZone - minValue;
        if (value === 0) {
          this.setPosition(Math.abs(minValue - (deadZone / 2)) * 100 / temp.valueSpread);
          return true;
        }
        return false;
      },
      setPositionByValue(value, minValue, maxValue, deadZone) {
        temp.valueSpread = maxValue + deadZone - minValue;
        if (value === 0) {
          temp.position = ((value - minValue) * 100 / temp.valueSpread) + (deadZone * 100 / temp.valueSpread / 2);
        } else if (value < 0) {
          temp.position = (value - minValue) * 100 / temp.valueSpread;
        } else {
          temp.position = ((value - minValue) * 100 / temp.valueSpread) + (deadZone * 100 / temp.valueSpread);
        }
        this.setPosition(temp.position);
      },
      setPosition(position) {
        this.position = position;
      }
    },
    mounted() {
      const $handle = this.$el.querySelector('.handle');
      const $meter = this.$el.querySelector('.meter');
      // calculate the min-max Y values
      const rect = $meter.getBoundingClientRect();
      this.minY = rect.y;
      this.maxY = rect.y + rect.height;
      this.height = rect.height;

      // set initial values
      this.value = this.initialValue;
      this.setPositionByValue(this.initialValue, this.minValue, this.maxValue, this.deadZone);

      multiDrag.activate({
        el: this.$el.querySelector('.handle'),
        onMove: (clientX, clientY, touch) => {
          let pixelDistance = clientY - this.minY;
          let percent = pixelDistance * 100 / this.height;
          if (percent < 0) percent = 0;
          if (percent > 100) percent = 100;
          this.position = 100 - percent;
          // trigger v-bind:update
          if (this.position !== this.previousPosition) {
            this.value = this.getValueByPosition(this.position, this.minValue, this.maxValue, this.deadZone);
            this.snapToDeadzone(this.value, this.minValue, this.maxValue, this.deadZone);
            this.$emit('update', this.value);
          }
          // use this compare to exit function early
          this.previousPosition = this.position;
        },
        onStart: (clientX, clientY, touch) => {
          this.active = true;
        },
        onEnd: (clientX, clientY, touch) => {
          this.active = false;
        }
      });
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
    padding: 4.5vw 3vw;
  }

  .meter {
    position: relative;
    background-color: #000;
    height: 100%;
    width: 100%;
    border-radius: 2vw;
    border-left: .8vw solid #1f1f1f;
    box-sizing: content-box;
  }

  .meterFill, .meterFillNegative {
    position: absolute;
    left: 0;
    height: 50%;
    width: 100%;
    background-color: #00c4ff;
    box-shadow: rgb(10, 204, 252) 0px 0px 3vh;
    border-radius: 2vw;
  }

  .meterFillNegative {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }

  .meterDeadZone {
    position: absolute;
    left: 0;
    width: 100%;
    background-color: #444;
  }

  .meterDeadZone .redLine {
    position: absolute;
    width: 130%;
    height: 1vw;
    background-color: red;
    top: 50%;
    left: -15%;
    margin-top: -0.5vw;
  }

  .handle {
    position: absolute;
    opacity: 1;
    bottom: 50%;
    left: -25%;
    cursor: pointer;
    z-index: 1050;
    height: 5vw;
    margin-bottom: -2.5vw;
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
