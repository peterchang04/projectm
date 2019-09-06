<template>
  <div id="targetsBar" class="proportionateHeightWrapper">
    <div class="content">
      <Target :index="0" :id="targets[0]" :hasRightNeighbor="hasRightNeighbor0" />
      <Target :index="1" :id="targets[1]" :noLeftNeighbor="noLeftNeighbor1" :hasRightNeighbor="hasRightNeighbor1" />
      <Target :index="2" :id="targets[2]" :noLeftNeighbor="noLeftNeighbor2" :hasRightNeighbor="hasRightNeighbor2" />
      <Target :index="3" :id="targets[3]" :noLeftNeighbor="noLeftNeighbor3"  />
    </div>
  </div>
</template>

<script>
  import Target from './Target.vue';
  import perf from '../../utils/perf.js';

  const temp = {};

  export default {
    name: 'targetsBar',
    components: { Target },
    props: {
      msg: String
    },
    data() {
      return {
        targets: [null, null, null, null],
      };
    },
    computed: {
      noLeftNeighbor1() {
        return (this.targets[1] && !this.targets[0]);
      },
      noLeftNeighbor2() {
        return (this.targets[2] && !this.targets[1]);
      },
      noLeftNeighbor3() {
        return (this.targets[3] && !this.targets[2]);
      },
      hasRightNeighbor0() {
        return Boolean(this.targets[1]);
      },
      hasRightNeighbor1() {
        return Boolean(this.targets[2]);
      },
      hasRightNeighbor2() {
        return Boolean(this.targets[3]);
      }
    },
    methods: {
      updateTargets() { perf.start('TargetsBar.updateTargets');
        // no updates
        if ($g.game.myShip.targets.join(',') === this.targets.join(',')) return perf.stop('TargetsBar.updateTargets');
        temp.newTargets = [];
        // 1. remove targets that are gone & copy the ones that aren't
        this.targets.map((id, i) => {
          if ($g.game.myShip.targets.indexOf(+id) === -1) {
            temp.newTargets[i] = null;
          } else {
            temp.newTargets[i] = id;
          }
        });
        // 2. figure out next open indexes
        temp.nextOpenTargets = [];
        this.targets.map((id, i) => {
          if (id === null) temp.nextOpenTargets.push(i);
        });
        // 3. now file new targets
        $g.game.myShip.targets.map((id) => {
          if (this.targets.indexOf(+id) === -1) {
            temp.newTargets[temp.nextOpenTargets[0]] = id;
            temp.nextOpenTargets.shift();
          }
        });
        // trigger the vue update
        this.targets = temp.newTargets;
        return perf.stop('TargetsBar.updateTargets');
      }
    },
    mounted() {
      temp.timer = setInterval(() => {
        this.updateTargets();
      }, 200);
    },
    destroyed() {
      clearInterval(temp.timer);
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* START This allows even height / width ratios across viewports */
  .proportionateHeightWrapper { position: absolute; width: 100%; }
  .proportionateHeightWrapper:before{ content: ""; display: block;
    padding-top: 16%; /* HEIGHT PROPORTION */
  }
  .proportionateHeightWrapper .content {
    position: absolute; top: 0; left: 0; bottom: 0; right: 0;
  }
  /* END This allows for proportionate height / width ratio across viewports */

  .content {
    text-align:left;
    z-index: 1100;
  }
  .content .target {
    display: inline-block;
    width: 25%;
    height: 100%;
  }
</style>
