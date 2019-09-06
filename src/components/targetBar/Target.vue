<template>
  <div
    class="target"
    v-bind:class="{
      hasTarget: Boolean(id),
      lastTarget: index === 3,
      leftBorder: noLeftNeighbor,
      hideRightBorder: hideRightBorder,
      isSelected: isSelected
    }"
    v-on:click="toggleSelected"
  >
    <canvas class="targetCanvas" :id="'targetCanvas_' + index"></canvas>
    <div class="entityName">{{ this.entityName }}</div>
    <div class="className">{{ this.className }}</div>
    <div class="direction" :style="arrowTransform">
      <div class="direction-arrow" :style="arrowOpacity"></div>
      <div class="distance" :style="reverseArrowTransform">{{ this.distanceOutput }}</div>
    </div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  import perf from '../../utils/perf.js';
  import format from '../../utils/format.js';

  const temp = {};

  export default {
    name: 'target',
    data() {
      return {
        updateCounter: 0,
        lastId: -1, // to track updates
        distance: -1,
        direction: -1,
        target: null,
      };
    },
    props: {
      id: Number,
      index: Number,
      noLeftNeighbor: Boolean, // whether or not to show a left border
      hasRightNeighbor: Boolean, // whether or not to hide a right border
    },
    methods: {
      drawCanvas() { perf.start('Target.methods.drawCanvas');
        if (this.id !== this.lastId) { // clear canvas on target change
          this.context.clearRect(0, 0, 142, 142);
          this.lastId = this.id;
        }

        if ($g.game.actors[this.id]) {
          this.context.clearRect(0, 0, 142, 142);
          if ($g.game.actors[this.id].svgCompositeData) this.context.drawImage($g.game.actors[this.id].svgCompositeData.canvases.rotate.canvas, 0, 0); // copy from rotate to skip targeting layer
        }
        perf.stop('Target.methods.drawCanvas');
      },
      toggleSelected() {
        if (this.id) {
          if ($g.game.myShip.target === this.id) {
            $g.game.myShip.target = null;
          } else {
            $g.game.myShip.target = this.id;
          }
        }
      }
    },
    computed: {
      isSelected() {
        return (this.id && this.target == this.id);
      },
      hideRightBorder() {
        return (!this.id && this.hasRightNeighbor);
      },
      arrowOpacity() {
        if (this.distance < 300) {
          temp.opacity = 0.9 - (this.distance * 0.6 / 300); // grade from 1 - 0.4
        } else {
          temp.opacity = 0.3;
          if (this.distance > 1000) temp.opacity = 0.2;
        }
        return `opacity:${temp.opacity};`;
      },
      arrowTransform() {
        return ($g.game.actors[this.id]) ? `transform:rotate(${this.direction}deg);` : null;
      },
      reverseArrowTransform() {
        return ($g.game.actors[this.id]) ? `transform:rotate(${-this.direction}deg);` : null;
      },
      entityName() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].name : null;
      },
      className() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].className : null;
      },
      distanceOutput() {
        return format.distance(this.distance);
      }
    },
    mounted() {
      // setup canvas
      this.canvas = document.getElementById(`targetCanvas_${this.index}`);
      this.canvas.width = 142;
      this.canvas.height = 142;
      this.context = this.canvas.getContext('2d');

      // kick off draw loop
      this.timer = setInterval(() => {
        if (!this.id) return;
        this.direction = $g.game.actors[this.id].directionFromMyShip - $g.game.myShip.d;
        this.distance = $g.game.actors[this.id].distanceFromMyShip;
        this.target = $g.game.myShip.target;
        this.drawCanvas();
      }, 150);
    },
    destroyed() {
      clearInterval(this.timer);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .target {
    position: relative;
    border-right: .6vw dashed rgba(255, 255, 255, 0.1);
    border-bottom: .6vw dashed rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  .hasTarget {
    border-right: .6vw solid rgba(255, 255, 255, 0.1);
    border-bottom: .6vw solid rgba(255, 255, 255, 0.1);
    background-color: #21292f77;
  }
  .lastTarget {
    border-right: none;
  }
  canvas.targetCanvas {
    display: none;
    width: 100%;
    margin-top: -12.5vw;
    top: 50%;
    left: 0;
    position: absolute;
  }
  .hasTarget canvas.targetCanvas {
    display: block;
  }
  .entityName {
    position: absolute;
    top: 0.3vw;
    width: 100%;
    left: 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 3vw;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
  .className {
    position: absolute;
    bottom: 0.3vw;
    width: 100%;
    left: 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 2.7vw;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
  .direction {
    display: none;
    height: 6vw;
    width: 6vw;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -3vw;
    margin-left: -3vw;
  }
  .direction-arrow {
    position: absolute;
    left: 2vw;
    bottom: 2.5vw;
    border-top: 20vw solid rgb(255, 45, 72);
    border-left: 1vw solid transparent;
    border-right: 1vw solid transparent;
  }
  .hasTarget .direction {
    display: block;
  }
  .distance {
    position: absolute;
    top: 3vw;
    left: 0.3vw;
    letter-spacing: 0.1vw;
    color: rgba(255, 255, 255, 0.6);
    font-size: 2.3vw;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
  .leftBorder {
    border-left: .6vw solid rgba(255, 255, 255, 0.1);
  }
  .hideRightBorder {
    border-right: none;
  }
  .isSelected {
    outline: 0.5vw solid #00c4ffDD;
    outline-offset: -0.5vw;
  }
  .isSelected .className, .isSelected .entityName {
    color: #00c4ffDD;
  }
</style>
