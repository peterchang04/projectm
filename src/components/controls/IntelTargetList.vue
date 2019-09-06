<template>
  <div id="intelTargetList" :style="mainStyle">
    <div id="intelTargetListScroll">
      <ul id="intelTargetListContent">
        <!--
          Since canvases can't be dynamically generated and initialized without some cost,
          we're going to pre-render all the available canvases. Hiding them if not used
        -->
        <li class="heading" v-if="hasTargets">targeted</li>

        <li v-for="i in maxTargetBar" :key="i + maxTargets" :class="{ hideRow: i > targetsTargeted.length, targetRow: true }">
          <IntelTarget :index="i + maxTargets" :id="targetsTargeted[i-1]" />
        </li>

        <li class="heading" v-if="targetsSorted.length">detected</li>
        <!-- -->
        <li v-for="index in maxTargets" :key="index" :class="{ hideRow: index > targetsSorted.length, targetRow: true }">
          <IntelTarget :index="index" :id="targetsSorted[index - 1]" />
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';
  import perf from '../../utils/perf.js';
  import IntelTarget from './IntelTarget.vue';
  import $g from '../../utils/globals.js';

  const temp = {};

  export default {
    name: 'intelTargetList',
    components: { IntelTarget },
    props: {
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 4 },
      gridRowStart: { type: Number, default: 2 },
      gridRows: { type: Number, default: 13 },
    },
    data() {
      return {
        maxTargetBar: 4,
        maxTargets: 25,
        targets: {},
        targetsSorted: [],
        targetsTargeted: [ null, null, null, null ],
        showTopOverscrollUI: false,
        showBottomOverscrollUI: false,
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
      hasTargets() { perf.start('IntelTargetList.computed.hasTargets');
        temp.hasTargets = false;
        this.targetsTargeted.map((id) => {
          temp.hasTargets = true;
        });
        perf.stop('IntelTargetList.computed.hasTargets');
        return temp.hasTargets;
      }
    },
    methods: {
      setSortTargets() { perf.start('IntelTargetList.methods.setSortTargets'); // set the list of targets and sort them
        // push all actors to targets
        temp.targetsSorted = [];
        Object.keys($g.game.actors).map((id) => {
          if ($g.game.actors[id].id !== $g.game.myShip.id && $g.game.myShip.targets.indexOf(+id) === -1) {
            temp.targetsSorted.push(+id);
          }
        });

        // sort the list
        temp.targetsSorted.sort((a, b) => {
          return $g.game.actors[a].distanceFromMyShip - $g.game.actors[b].distanceFromMyShip;
        });

        // remove empties from targetted list
        temp.targetsTargeted = [];
        $g.game.myShip.targets.map((id) => {
          if (id !== null) temp.targetsTargeted.push(id);
        });
        // assign and trigger redraw
        this.targetsSorted = temp.targetsSorted;
        this.targetsTargeted = temp.targetsTargeted;
        return perf.stop('IntelTargetList.methods.setSortTargets');
      },
    },
    mounted() {
      this.setSortTargets(); // figure out which targets are to be displayed
      // start a loop to update target list
      temp.timer = setInterval(() => {
        this.setSortTargets();
      }, 200);
    },
    destroyed() {
      // cleanup
      clearInterval(temp.timer);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #intelTargetList {
    position: relative; /* to allow for span positioning */
    font-family: 'Raleway';
    text-transform: uppercase;
    letter-spacing: 0.1vw;
    font-size: 2.7vw;
    height: 105%;
    overflow: hidden;
  }
  #intelTargetListScroll {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: absolute;
  }
  #intelTargetList > div > ul {
    padding-bottom: 3vw; /* allow overflow to be scrolled-up to apporximately bottom of screen */
  }
  .panelGrid {
    /* grid-template-rows: repeat(13, 8.3%);  NOTE: there are actually only 12 rows. 13th row is used to give effect of offscreen */
  }
  .hideRow {
    opacity: 0;
    height: 0;
    border-bottom: 0 !important;
    overflow: hidden;
  }
  li.heading {
    text-align: center;
    color: #bbb;
    font-size: 2.3vw;
    line-height: 3.5vw;
    background-color: rgba(0, 0, 0, .2);
  }
</style>
