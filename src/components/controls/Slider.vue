<template>
  <div class="slider" :class="{ active: active }">
    <div class="title"><span>{{ title }}</span></div>

    <div class="progressBar" :class="{ animate: animate }">
      <div class="progressBarFillWrapper">
        <div class="actualProgressBarFill" :style="actualProgressBarFill"></div>
        <div class="progressBarFill" :style="progressStyle"></div>
      </div>

      <span class="progressText" :class="{ offsetProgressText: offsetProgressText }">{{ actualPercent }}%</span>
    </div>

    <div class="leverGroove">
      <div class="leverGrooveInner">
        <div class="leverHandle" :style="handleStyle">
          <div class="leverHandleLine" :style="handleLineStyle">
            <span class="leverHandleLineReading" :style="handleReadingStyle">
              {{ percent }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';

  export default {
    name: 'slider',
    props: {
      title: { type: String, default: 'Something' },
      initialPercent: { type: Number, default: 0 },
      width: { type: Number, default: 20 }
    },
    data: function() {
      return {
        percent: 0, // THE HANDLE VALUE
        actualPercent: 0, // THE OUTPUT VALUE, which is delayed from handle after change
        minX: 0, // in pixels, varies by viewports
        maxX: 0, // in pixels, varies by viewports
        grooveWidth: 0, // in pixels, varies by viewports
        active: false, // whether the slider is being manipulated
        activateXOffset: 0, // e.g. touching the right edge of lever shouldn't make it jump
        clearTimeoutActualProgress: null, // pointer for stored setTimeouts
        animate: false,
        offsetProgressText: false, // when > 85% so handle doesn't cover text
      };
    },
    created: function () {
      this.percent = (Math.round(this.initialPercent / 5)) * 5 || 0;
      this.actualPercent = (Math.round(this.initialPercent / 5)) * 5 || 0;
    },
    mounted: function () {
      // target the handle
      const $leverHandle = this.$el.querySelector('.leverHandle');
      const $leverGrooveInner = this.$el.querySelector('.leverGrooveInner');

      // calculate the pixel width of slider for this viewport
      const rect = $leverGrooveInner.getBoundingClientRect();
      this.minX = rect.x;
      this.maxX = rect.x + rect.width;
      this.grooveWidth = rect.width;

      // init the dragging actions
      multiDrag.activate({
        el: $leverHandle,
        onMove: (e) => {
          // stop any current setTimeouts
          clearTimeout(this.clearTimeoutActualProgress);

          // calculate percent from current X
          const pixelDistance = e.touches[0].clientX - this.minX;
          let percent = pixelDistance * 100 / this.grooveWidth;
          if (percent < 0) percent = 0;
          if (percent > 100) percent = 100;
          // round to nearest 5
          this.percent = (Math.round(percent / 5)) * 5;
          // we do this here, because sometimes the onStart even triggers too slow, so trigger repeated by moving
          if (this.animate) this.animate = false;

          // adjust progress text if handle covers it
          this.offsetProgressText = (this.percent > 85) ? true : false;
        },
        onStart: (e) => {
          // calculate activateX and activateX offset
          this.activateX = e.touches[0].clientX;
          const currentXFromPercent = (this.percent * this.grooveWidth / 100) + this.minX;
          this.activateXOffset = currentXFromPercent - this.activateX + this.minX;
          this.active = true;

        },
        onEnd: (e) => {
          this.active = false;
          if (this.actualPercent === this.percent) return;

          const moveActualProgress = () => {
            if (this.actualPercent > this.percent) {
              this.actualPercent = this.actualPercent - 5;
            }
            if (this.actualPercent < this.percent) {
              this.actualPercent = this.actualPercent + 5;
            }
            // exit the loop
            if (this.actualPercent === this.percent) return;
            // didn't exit, setup the next call
            clearTimeout(this.clearTimeoutActualProgress);
            this.clearTimeoutActualProgress = setTimeout(() => {
              this.animate = true;
              moveActualProgress();
            }, 500);
          };

          moveActualProgress(); // kick it off
        }
      });
    },
    computed: {
      progressStyle: function() {
        if (this.active && this.percent < this.actualPercent) {
          return `width:${this.actualPercent}%`;
        }
        return `width:${this.percent}%`;
      },
      actualProgressBarFill: function() {
        if (this.active && this.percent < this.actualPercent) {
          return `width:${this.actualPercent - (this.actualPercent - this.percent)}%`;
        }

        return `width:${this.actualPercent}%;box-shadow:0 0 2vh rgba(10, 204, 252, ${this.actualPercent / 100});`;
      },
      handleStyle: function() {
        return `left:${this.percent}%`;
      },
      handleLineStyle: function() {
        if (this.active) {
          return `opacity:1`;
        }
        return `opacity:0`;
      },
      handleReadingStyle: function () {
        if (this.percent < 85) {
          return 'left:1.2vw';
        }
        return 'right:1.2vw';
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slider {
    display: inline-block;
  }
  .slider .title {
    background-color: #222;
    color: white;
    text-transform: uppercase;
    font-size: 3.5vw;
    padding-left: 1.1vw;
    padding-top: .9vw;
    line-height: 3.3vw;
    border-top-right-radius: 1.5vw;
    border-top-left-radius: 1.5vw;
  }
  .slider .title span {
    opacity: 1;
    transition: opacity .5s;
  }
  .slider.active .title span {
    opacity: .07;
  }
  .slider .progressBar {
    width: 35vw;
    height: 5vw;
    background-color: #222;
    text-transform: uppercase;
    position: relative;
    padding: .65vw;
  }
  .slider .progressBarFillWrapper {
    position: relative;
    height: 100%;
  }
  .slider .progressBarFill {
    background-color: rgba(10, 204, 252, .3);
    height: 100%;
    position: absolute;
  }
  .slider .actualProgressBarFill {
    position: absolute;
    background-color: #0ACCFC;
    height: 100%;
  }
  .slider .progressBar.animate .actualProgressBarFill { /* when active (mousedown) no animate */
    transition: width .8s;
  }
  .slider .progressText {
    position: absolute;
    color: white;
    line-height: 5.5vw;
    width: 100%;
    font-size: 3.3vw;
    text-align: right;
    padding-right: 1vw;
    left: 0;
    top: 0;
  }
  .slider .progressText.offsetProgressText {
    padding-right: 3vw;
  }
  .slider .leverGroove {
    background-color: #222;
    position: relative;
    padding: .25vw 1vw .65vw 1vw;
    padding-top: 0;
  }
  .slider .leverGrooveInner {
    height: 1.3vw;
    width: 100%;
    background-color: #151515;
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
    border-right: .8vw solid rgba(0,0,0,.3);
    border-left: .8vw solid rgba(255, 255, 255, .3)
  }
  .slider .leverHandleLine {
    width: .5vw;
    height: 3vw;
    background-color: #e54646;
    position: absolute;
    top: -3vw;
    left: .5vw;
    border-top-left-radius: 1vw;
    border-top-right-radius:1vw;
    transition: opacity .8s;
    pointer-events:none;
  }
  .slider .leverHandleLineReading {
    color: #e54646;
    font-size: 3vw;
    top: -.5vw;
    position: absolute;
    pointer-events:none;
    /* left: 1.5vw; Computed value */
  }
</style>
