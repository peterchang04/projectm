<template>
  <div
    class="target"
    v-bind:class="classObj"
    v-on:click="toggleSelected"
    :_index="index"
    :_id="id"
  >
    <canvas class="targetCanvas" :id="'targetCanvas_' + index"></canvas>
    <div class="entityName">{{ this.entityName }}</div>
    <div class="className">{{ this.className }}</div>
    <div class="direction" :style="arrowTransform">
      <div class="direction-arrow" :style="arrowOpacity"></div>
      <div class="distance" :style="reverseArrowTransform">{{ this.distanceOutput }}</div>
    </div>
    <!-- <div>{{ index }}</div> -->
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
      targets: Array,
      parentClass: { type: String, default: '' },
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
      classObj() {
        return {
          hasTarget: Boolean(this.id),
          isSelected: this.isSelected,
          // these are used by viewport css generator to handle target borders
          nextHasTarget: Boolean(this.targets[this.index + 1]),
          lastHasTarget: Boolean(this.targets[this.index - 1]),
          hasTarget0: Boolean(this.targets[0]),
          hasTarget1: Boolean(this.targets[1]),
          hasTarget2: Boolean(this.targets[2]),
          hasTarget3: Boolean(this.targets[3]),
        };
      },
      className() {
        // the is the class of the obj, not the css class
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].className : null;
      },
      distanceOutput() {
        return format.distance(this.distance);
      },
    },
    mounted() {
      // setup canvas
      this.canvas = document.getElementById(`targetCanvas_${this.index}`);
      this.canvas.width = 142;
      this.canvas.height = 142;
      this.context = this.canvas.getContext('2d');

      // kick off draw loop
      this.timer = setInterval(() => {
        if (!this.id || !$g.game.actors[this.id]) return;
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
  #targetsBar .target {
    position: relative;
    border-color: #222222;
    border-style: dashed;
    overflow: hidden;
  }
  #targetsBar .content .target.hasTarget {
    border-style: solid;
    background-color: #21292f77;
  }
  #targetsBar .content .target.isSelected {
    outline-style: solid;
    outline-color: #00c4ff;
  }
  .isSelected .className, .isSelected .entityName {
    color: #00c4ffDD;
  }
  canvas.targetCanvas {
    display: none;
    width: 100%;
    margin-top: -50%;
    top: 50%;
    left: 0;
    position: absolute;
  }
  .hasTarget canvas.targetCanvas {
    display: block;
  }
  .entityName {
    position: absolute;
    top: 5%;
    width: 100%;
    left: 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
  .className {
    position: absolute;
    bottom: 5%;
    width: 100%;
    left: 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
  .direction {
    display: none;
    width: 25%;
    padding-top: 25%; /* fake same as width */
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -12.5%;
    margin-left: -12.5%;
  }
  .direction-arrow {
    position: absolute;
    left: 8%;
    bottom: 50%;
    border-top: 5em solid rgb(255, 45, 72);
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
  }
  .hasTarget .direction {
    display: block;
  }
  .distance {
    position: absolute;
    top: 50%;
    left: 5%;
    letter-spacing: 0.1vw;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.5em;
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
  }
</style>
