<template>
  <div class="target" v-bind:class="{ hasTarget: Boolean(id), lastTarget: index === 3 }" :updateCounter="updateCounter">
    <canvas class="targetCanvas" :id="'targetCanvas_' + index"></canvas>
    <div class="entityName">{{ this.entityName }}</div>
    <div class="className">{{ this.className }}</div>
    <div class="direction"></div>
    <div class="distance"></div>
  </div>
</template>

<script>
  import $g from '../../utils/globals.js';
  const temp = {};

  export default {
    name: 'target',
    data() {
      return {
        updateCounter: 0,
      };
    },
    props: {
      id: Number,
      index: Number
    },
    methods: {
      drawCanvas() {
        if ($g.game.actors[this.id]) {
          this.context.clearRect(0, 0, 142, 142);
          this.context.drawImage($g.game.actors[this.id].svgCompositeData.canvases.last.canvas, 0, 0);
        }
      }
    },
    computed: {
      entityName() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].name : null;
      },
      className() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].className : null;
      },
      direction() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].className : null;
      },
      distance() {
        return ($g.game.actors[this.id]) ? $g.game.actors[this.id].className : null;
      }
    },
    mounted() {
      this.canvas = document.getElementById(`targetCanvas_${this.index}`);
      this.canvas.width = 142;
      this.canvas.height = 142;
      this.context = this.canvas.getContext('2d');

      // kick off draw loop
      this.timer = setInterval(() => {
        this.updateCounter++;
        this.drawCanvas();
      }, 100);
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
    border-right: 2px dashed rgba(255, 255, 255, 0.1);
    border-bottom: 2px dashed rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  .hasTarget {
    border-right: 2px solid rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    background-color: #0e0e0e;
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
    color: rgba(255, 255, 255, 0.4);
    font-size: 3.5vw;
  }
  .className {
    position: absolute;
    bottom: 0.3vw;
    width: 100%;
    left: 0;
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    font-size: 3.5vw;
  }
</style>
