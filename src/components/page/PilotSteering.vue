<template>
  <div id="steering">
    <div id="rotateDragger" :style="rotateDraggerStyle">
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
        screenDegree: 0,
        active: false,
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
        },
        onMove: (e) => {
          console.log(centerX, centerY, e.touches[0].clientX, e.touches[0].clientY);
          this.screenDegree = maths.getDegree2P(
            { x: centerX, y: $g.viewport.viewportHeight - centerY },
            { x: e.touches[0].clientX, y: $g.viewport.viewportHeight - e.touches[0].clientY },
          );
          // console.log(this.screenDegree);
        },
        onEnd: (e) => {
          this.active = false;
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
    bottom: 13%;
    overflow: hidden;
    background-color: transparent;
    width: 50vw;
    height: 50vw;
    margin-left: -25vw;
    border-radius: 50vw;
    pointer-events: none;
  }
  #rotateDragger {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  #dragger {
    position: absolute;
    width: 14vw;
    height: 14vw;
    border-radius: 14vw;
    top: 0;
    left: 50%;
    margin-left: -7vw;
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
</style>
