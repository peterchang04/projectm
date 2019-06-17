<template>
  <div id="steering">
    <div id="rotateDragger" :style="rotateDraggerStyle">
      <span id="draggerText" v-if="screenDegree != 0 || active">{{ dTarget.toFixed(1) }}°</span>
      <div id="dragger" :class="{ draggerActive: active }" :style="draggerStyle">
      </div>
    </div>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';
  import maths from '../../utils/maths.js';
  import $g from '../../utils/globals.js';

  export default {
    name: 'pilot',
    components: {},
    data: function() {
      return {
        direction: 0, // 1 for clockwise, -1 for counter
        screenDegree: 0,
        active: false,
        dTarget: 0,
      };
    },
    mounted: function() {
      const rotateDragger = this.$el.querySelector('#rotateDragger');
      const dragger = this.$el.querySelector('#dragger');
      // get boundaries for computations
      const bounds = rotateDragger.getBoundingClientRect();
      const centerX = bounds.left + (bounds.width / 2);
      const centerY = bounds.top + (bounds.height / 2);

      multiDrag.activate({
        el: dragger,
        onStart: (e) => {
          this.active = true;
          if (this.direction === 0) this.direction = 1; // initialize this value, or the first press could be -359.9 dTurn

          /*
            doing this in onStart because ship may not be loaded before multiDrag
            addOnUpdate won't overwrite if function exists already.
          */
          $g.game.myShip.addOnUpdate('dTurn', 'pilotSteering', (value, oldValue, obj) => {
            // update the position of #dragger as ship turns, if not active
            if (!this.active) {
              this.screenDegree = (value < 0) ? 360 + value : value;
            }
          });
        },
        onMove: (e) => {
          this.screenDegree = maths.getDegree2P(
            { x: centerX, y: $g.viewport.viewportHeight - centerY },
            { x: e.touches[0].clientX, y: $g.viewport.viewportHeight - e.touches[0].clientY },
          );
          this.screenDegree = maths.roundHalf(this.screenDegree);

          // decide if we're going clock or counter
          if (this.screenDegree >= 0  && this.screenDegree < 30) {
            this.direction = 1;
          } else if (this.screenDegree <= 360 && this.screenDegree > 330) {
            this.direction = -1;
          }

          // dTurn decrements as the ship turns
          $g.game.myShip.dTurn = (this.direction !== -1) ? this.screenDegree : (360 - this.screenDegree) * -1;
          // dTarget was the intended direction
          $g.game.myShip.dTarget = ($g.game.myShip.d + $g.game.myShip.dTurn) % 360;
          this.dTarget = $g.game.myShip.dTarget;
        },
        onEnd: (e) => {
          this.active = false;
        },
        onDown: (e) => {
          if (this.active) { // continue updating dTurn, dTarget as if moving
            // dTurn decrements as the ship turns
            $g.game.myShip.dTurn = (this.direction === 1) ? this.screenDegree : (360 - this.screenDegree) * -1;
            // dTarget was the intended direction
            $g.game.myShip.dTarget = ($g.game.myShip.d + $g.game.myShip.dTurn) % 360;
            this.dTarget = $g.game.myShip.dTarget;
          }
        }
      });
    },
    computed: {
      rotateDraggerStyle: function () {
        return `transform:rotate(${this.screenDegree}deg)`;
      },
      draggerStyle: function() {
        return `transform:rotate(-${this.screenDegree}deg)`;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* positioning should be similar to <ShipView /> #canvas_myShip */
  #steering {
    position: absolute;
    left: 50%;
    bottom: 8%;
    background-color: transparent;
    width: 56vw;
    height: 56vw;
    margin-left: -28vw;
    border-radius: 56vw;
    pointer-events: none;
  }
  #rotateDragger {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  #dragger {
    position: absolute;
    width: 16vw;
    height: 16vw;
    border-radius: 14vw;
    top: 0;
    left: 50%;
    margin-left: -8vw;
    border: .5vw dashed rgba(0, 255, 0, .2);
    font-weight: bold;
    font-size: 3.7vw;
    line-height: 14vw;
    letter-spacing: -.25vw;
    pointer-events: auto;
    font-family: 'Share Tech Mono', 'Courier New', Arial;
    user-select: none;
  }
  #dragger.draggerActive {
    background-color: rgba(0, 255, 0, .1);
  }
  #draggerText {
    color: rgba(0, 255, 0, .2);
    position: absolute;
    left: 50%;
    top: -5vw;
    margin-left: -6vw;
    width: 14vw;
    padding-right: 1vw;
    font-size: 4vw;
  }
</style>
