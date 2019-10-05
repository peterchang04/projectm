<template>
  <ul class="intelTarget">
    <li class="action">
      <AddTargetSVG class="addTargetSVG" v-on:click="toggleTarget" v-if="!isTarget && !allTargets" />
      <RemoveTargetSVG class="removeTargetSVG" v-on:click="toggleTarget" v-if="isTarget" />
    </li>

    <li class="canvas">
      <canvas class="targetListCanvas" :id="'targetListCanvas_' + index"></canvas>
      <div class="hullBar"></div>
      <div class="entityName">{{ this.name }}</div>
      <!-- The directional arrow -->
      <div class="direction" :style="arrowTransform">
        <div class="direction-arrow" :style="arrowOpacity"></div>
      </div>
    </li>

    <li class="body">
    </li>

    <li class="open">
      <Caret />
      <div class="distance">{{ this.distanceFormatted }}</div>
    </li>
  </ul>
</template>

<script>
  import format from '../../utils/format.js';
  import $g from '../../utils/globals.js';
  import perf from '../../utils/perf.js';
  import Caret from '../../../public/assets/svg/icons/down-caret.svg';
  import AddTargetSVG from '../../../public/assets/svg/icons/marker-add.svg';
  import RemoveTargetSVG from '../../../public/assets/svg/icons/marker-remove.svg';

  const temp = {};

  export default {
    name: 'intelTarget',
    components: { AddTargetSVG, RemoveTargetSVG, Caret },
    data() {
      return {
        direction: -1,
        distance: -1,
        name: null,
        isTarget: false,
        allTargets: false,
      };
    },
    props: {
      index: Number,
      id: Number,
    },
    computed: {
      distanceFormatted() { perf.start('IntelTarget.computed.distanceFormatted');
        temp.distance = format.distance(this.distance);
        perf.stop('IntelTarget.computed.distanceFormatted');
        return temp.distance;
      },
      arrowOpacity() { perf.start('IntelTarget.computed.arrowOpacity');
        if (this.distance < 300) {
          temp.opacity = 0.9 - (this.distance * 0.6 / 300); // grade from 1 - 0.4
        } else {
          temp.opacity = 0.3;
          if (this.distance > 1000) temp.opacity = 0.2;
        }
        temp.opacity = `opacity:${temp.opacity};`;
        perf.stop('IntelTarget.computed.arrowOpacity');
        return temp.opacity;
      },
      arrowTransform() {
        return ($g.game.actors[this.id]) ? `transform:rotate(${this.direction - $g.game.myShip.d}deg);` : null;
      },
    },
    mounted: function() {
      // initialize the canvas
      this.canvas = document.getElementById(`targetListCanvas_${this.index}`);
      this.canvas.width = 142;
      this.canvas.height = 142;
      this.context = this.canvas.getContext('2d');

      // start a loop to update the canvas
      temp.timer = setInterval(() => {
        this.updateCanvas();
      }, 150);
    },
    methods: {
      toggleTarget() {
        if ($g.game.myShip.targets.indexOf(+this.id) >= 0) {
          $g.game.myShip.removeTarget(this.id);
        } else {
          $g.game.myShip.addTarget(this.id);
        }
      },
      updateCanvas() { perf.start('IntelTarget.methods.updateCanvas');
        if (this.id && $g.game.actors[this.id]) {
          this.distance = $g.game.actors[this.id].distanceFromMyShip;
          this.direction = $g.game.actors[this.id].directionFromMyShip;
          this.name = $g.game.actors[this.id].name;
          this.isTarget = Boolean($g.game.myShip.targets.indexOf(+this.id) >= 0);
          // see if all targets are taken up
          this.allTargets = true;
          $g.game.myShip.targets.map((id) => {
            if (id === null) this.allTargets = false;
          });

          // update canvas
          this.context.clearRect(0, 0, 142, 142);
          if ($g.game.actors[this.id].svgCompositeData) this.context.drawImage($g.game.actors[this.id].svgCompositeData.canvases.rotate.canvas, 0, 0);
        }
        return perf.stop('IntelTarget.methods.updateCanvas');
      }
    },
    destroyed() {
      clearInterval(temp.timer);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul.intelTarget {
    height: 4em;
    border-bottom: .1em solid rgba(255, 255, 255, .04);
  }
  ul.intelTarget > li {
    display: inline-block;
    height: 100%; /* matches canvas dimensions */
    position: relative;
    background-color: rgba(0, 0, 0, .5);
  }
  canvas.targetListCanvas {
    width: 100%;
    height: 100%;
  }
  li.open {
    width: 15%;
  }
  li.canvas {
    position: relative;
    width: 25%;
    overflow: hidden;
  }
  li.canvas > .entityName {
    position: absolute;
    top: 5%;
    left: 0;
    width: 100%;
    color: #bbb;
    text-align: center;
    font-size: 0.8em;
  }
  li.body {
    width: 43%;
  }
  li.action {
    width: 17%;
    position: relative;
  }
  ul.intelTarget svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80%;
    height: 52%; /* this is proportionate to width */
    margin-left: -40%;
    margin-top: -40%;
  }
  .addTargetSVG {
    opacity: 0.4;
    filter: grayscale(1);
  }
  .hullBar {
    background-color: rgb(94, 167, 38, .4);
    position: absolute;
    width: 86%;
    left: 7%;
    bottom: 7%;
    height: 8%;
  }
  .distance {
    font-size: 0.65em;
    color: #bbb;
    text-align: center;
    left: -14%;
    width: 100%;
    top: 6%;
    position: absolute;
  }
  .open svg {
    top: 50% !important;
    opacity: .6;
  }
  .direction {
    height: 50%;
    width: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -25%;
    margin-left: -25%;
  }
  .direction-arrow {
    position: absolute;
    left: 25%;
    bottom: 50%;
    border-top: 5em solid rgb(255, 45, 72);
    border-left: 0.5em solid transparent;
    border-right: 0.5em solid transparent;
  }
</style>
