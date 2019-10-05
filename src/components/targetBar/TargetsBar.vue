<template>
  <div id="targetsBar">
    <div class="content left">
      <Target :index="0" :id="targets[0]" :targets="targets" />
      <Target :index="1" :id="targets[1]" :targets="targets" />
    </div>

    <div class="content right">
      <!-- NOTE: CSS is displaying these two from right to left (reverse) to accommodate vertical sorting for stackLayout -->
      <Target :index="3" :id="targets[3]" :targets="targets" />
      <Target :index="2" :id="targets[2]" :targets="targets" />
    </div>
  </div>
</template>

<script>
  import Target from './Target.vue';
  import perf from '../../utils/perf.js';
  import { mapState } from 'vuex';

  const temp = {};

  export default {
    name: 'targetsBar',
    components: { Target },
    props: {
      msg: String,
    },
    data() {
      return {
        targets: [null, null, null, null],
      };
    },
    computed: {
      ...mapState([
        'currentRole',
      ]),
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
  #targetsBar {
    font-size: 60%;
    font-family: 'Raleway';
    position: absolute;
    z-index: 1100;
  }
  .content {
    text-align:left;
    position: absolute;
    left: 0;
    display: inline-block;
    z-index: 1100;
  }
  .content.right {
    left: auto;
    right: 0;
    direction: rtl; /* flips the draw flow of targets from right to left. This is helpful when we go to vertical quad grid arrangement, and want to fill from top to bottom */
  }
  .content .target {
    display: inline-block;
    width: 50%;
    padding-top: 32%; /* fake the height to be 64% proportionally to width */
  }
</style>
