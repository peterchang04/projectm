<template>
  <div id="intelTargetList" :style="mainStyle">
    <ul>
      <!--
        Since canvases can't be dynamically generated and initialized without some cost,
        we're going to pre-render all the available canvases. Hiding them if not used
      -->
      <li v-for="index in maxTargets" :key="index" :class="{ hideRow: index > targetsSorted.length, targetRow: true }">
        <ul class="columns">
          <li class="location" :update="updateCounter" v-if="index <= targetsSorted.length">
            <div class="distance">{{ formatDistance(targets[targetsSorted[index-1]].distance) }}</div>
            <div class="direction">{{ formatDirection(targets[targetsSorted[index-1]].direction) }}</div>
          </li>
          <li class="canvas">
            <canvas class="targetListCanvas" :id="'targetListCanvas_' + index"></canvas>
            <div class="hullBar"></div>
            <div class="entityName" v-if="index <= targetsSorted.length">{{ targets[targetsSorted[index-1]].name }}</div>
          </li>
          <li class="remainder">
            <button v-on:click="toggleTarget(targetsSorted[index-1])">PIN</button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';
  import $g from '../../utils/globals.js';
  import maths from '../../utils/maths.js';

  const temp = {};

  export default {
    name: 'intelTargetList',
    props: {
      maxTargets: { type: Number, default: 25 },
      status: String,
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 5 },
      gridRowStart: { type: Number, default: 2 },
      gridRows: { type: Number, default: 13 },
    },
    data() {
      return {
        updateCounter: 0, // tick this up to trigger redraw
        targets: {},
        targetsSorted: [],
      };
    },
    computed: {
      mainStyle() {
        return {
          'grid-column-start': this.gridColumnStart,
          'grid-column-end': this.gridColumnStart + this.gridColumns,
          'grid-row-start': this.gridRowStart,
          'grid-row-end': this.gridRowStart + this.gridRows,
        };
      },
    },
    methods: {
      updateTargets() { // feeds the currently listed targets updated information
        Object.keys($g.game.actors).map((id) => {
          if (this.targets[id]) {
            // calculate distance
            this.targets[id].distance = maths.getDistance($g.game.myShip.mX, $g.game.myShip.mY, $g.game.actors[id].mX, $g.game.actors[id].mY);
            this.targets[id].direction = maths.getDegree2P($g.game.myShip.mX, $g.game.myShip.mY, $g.game.actors[id].mX, $g.game.actors[id].mY);
            this.targets[id].name = $g.game.actors[id].name;
          }
        });
        this.updateCounter++;
      },
      setSortTargets() { // set the list of targets and sort them
        // push all actors to targets
        temp.targetList = [];
        Object.keys($g.game.actors).map((id) => {
          if ($g.game.actors[id].id !== $g.game.myShip.id) {
            temp.targetList.push(id);
            // replace only if it doesn't exist
            if (!this.targets[id]) this.targets[id] = {};
          } else {
            delete this.targets[id];
          }
        });
        this.updateTargets(); // do the first set of computations
        this.targetsSorted = temp.targetList.sort((a, b) => {
          return (a.distance < b.distance);
        });
      },
      formatDistance(dist) {
        if (dist < 1000) return `${dist.toFixed(0)}m`;
        return `${(dist / 1000).toFixed(1)}km`;
      },
      formatDirection(dir) {
        return `${dir.toFixed(0)}°`;
      },
      drawCanvases() {
        this.targetsSorted.map((id, i) => {
          this.contexts[i].clearRect(0, 0, 142, 142);
          this.contexts[i].drawImage($g.game.actors[id].svgCompositeData.canvases.last.canvas, 0, 0);
        });
      },
      toggleTarget(id) {
        if ($g.game.myShip.targets.indexOf(+id) >= 0) {
          $g.game.myShip.removeTarget(id);
        } else {
          $g.game.myShip.addTarget(id);
        }
      },
    },
    mounted() {
      this.setSortTargets(); // figure out which targets are to be displayed
      // initialize the canvases attached to vue
      this.contexts = [];
      for (temp.i = 0; temp.i < this.maxTargets; temp.i++) {
        temp.canvas = document.getElementById(`targetListCanvas_${temp.i+1}`);
        temp.canvas.width = 142;
        temp.canvas.height = 142;
        this.contexts.push(temp.canvas.getContext('2d'));
      }
      // start a loop to update targets
      temp.timer = setInterval(() => {
        this.updateTargets();
      }, 150);
      // start a loop to draw on canvas
      temp.timer2 = setInterval(() => {
        this.drawCanvases();
      }, 100);
    },
    destroyed() {
      // stop background noise
      clearInterval(temp.timer);
      clearInterval(temp.timer2);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #intelTargetList {
    position: relative; /* to allow for span positioning */
    background-color: rgba(0, 0, 0, .5);
  }
  .panelGrid {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(13, 8.3%); /* NOTE: there are actually only 12 rows. 13th row is used to give effect of offscreen */
    background-color: #21292f;
  }
  ul.columns li {
    display: inline-block;
  }
  canvas.targetListCanvas {
    width: 12vw;
  }
  .hideRow {
    opacity: 0;
    height: 0;
  }
  li.location {
    width: 10vw;
    text-align: center;
    color: rgba(255, 255, 255, .4);
    font-size: 3.5vw;
    line-height: 5vw;
    padding: 1vw 0;
  }
  li.canvas {
    position: relative;
  }
  .entityName {
    position: absolute;
    top: 1vw;
    font-size: 3.5vw;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, .4);
  }
  .hullBar {
    background-color: rgb(94, 167, 38, .4);
    position: absolute;
    width: 8vw;
    left: 2vw;
    bottom: 1.5vw;
    height: 1vw;
  }
  li.remainder {
    text-align: right;
    padding: 3vw;
    width: 36vw;
  }
  li.targetRow {
    border-bottom: 0.3vw solid rgba(255, 255, 255, 0.2);
  }
</style>
