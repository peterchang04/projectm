<template>
  <div id="bgStars">
    <canvas id="bgStarCanvas" />
  </div>
</template>

<script>
  import maths from '../../../utils/maths.js';
  import $g from '../../../utils/globals.js';
  import TargetsBar from '../../targetBar/TargetsBar.vue';
  import eventManager from '../../../utils/eventManager.js';

  let stars = [];
  let canvas, context;
  const temp = { lastUpdate: Date.now() };

  export default {
    name: 'bgStars',
    components: {
    },
    props: {
      msg: String
    },
    methods: {
      initCanvas() {
        canvas.width = $g.viewport.width * $g.viewport.pixelRatio;
        canvas.height = $g.viewport.height * $g.viewport.pixelRatio;
        this.generateStars();
      },
      generateStars() {
        // reset starting coordinates
        temp.offsetX = 0;
        temp.offsetY = 0;

        stars = []; // start over
        // how many stars?
        const starCount = Math.ceil($g.viewport.width * $g.viewport.height / 22000);
        // far, slow stars
        for (let i = 0; i < Math.ceil(starCount * 0.3); i++) {
          stars.push({
            x: maths.random(0, canvas.width),
            y: maths.random(0, canvas.height),
            w: maths.random(10, 15) / 10 * $g.viewport.pixelRatio,
            c: `rgba(255,255,255,${maths.random(25, 50) / 100})`,
            scale: maths.random(50, 200) / 1000, // 0 - 0.2 in scale
          })
        }
        // medium speed stars
        for (let i = 0; i < Math.ceil(starCount * 0.5); i++) {
          stars.push({
            x: maths.random(0, canvas.width),
            y: maths.random(0, canvas.height),
            w: maths.random(10, 20) / 10 * $g.viewport.pixelRatio,
            c: `rgba(255,255,255,${maths.random(70, 90) / 100})`,
            scale: maths.random(200, 900) / 1000, // .3 - .7 in scale
          })
        }
        // fast speed stars
        for (let i = 0; i < Math.ceil(starCount * 0.2); i++) {
          stars.push({
            x: maths.random(0, canvas.width),
            y: maths.random(0, canvas.height),
            w: maths.random(10, 20) / 10 * $g.viewport.pixelRatio,
            c: `rgba(255,255,255,${maths.random(50, 70) / 100})`,
            scale: maths.random(2500, 5500) / 1000, // 3 - 4.5 in scale
          })
        }
      },
      update() {
        temp.now = Date.now();
        temp.elapsed = (temp.now - temp.lastUpdate) / 1000;
        temp.lastUpdate = temp.now;
        temp.offsetX += (0 * temp.elapsed);
        temp.offsetY += (120 * temp.elapsed);
      },
      draw() {
        requestAnimationFrame(this.draw);
        context.clearRect(0, 0, canvas.width, canvas.height);
        stars.map((star) => {
          context.fillStyle = star.c;
          context.beginPath();
          context.arc(
            (star.x + (temp.offsetX * star.scale)) % canvas.width,
            (star.y + (temp.offsetY * star.scale)) % canvas.height,
            star.w,
            0,
            $g.constants.PI2
          );
          context.fill();
        });
      }
    },
    mounted() {
      $g.viewport.update(); // get current screen setup
      canvas = document.getElementById('bgStarCanvas');
      context = canvas.getContext('2d');
      this.initCanvas();
      // kickoff loop
      temp.updateTimer = setInterval(() => {
        this.update();
      }, 1000 / 60); // 60fps
      // kickoff draw
      this.draw();

      // listen for updates
      eventManager.add(window, 'viewportUpdated.bgStars', () => {
        this.initCanvas();
      });
    },
    destroyed() {
      clearInterval(this.updateTimer);
    }
  };
</script>

<style>
  #bgStars {
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: -1;
  }
  #bgStars canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
</style>
