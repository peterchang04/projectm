<template>
  <div id="intelTargetList" :style="mainStyle">
    <div class="margin">

    </div>
  </div>
</template>

<script>
  import multiDrag from '../../utils/multiDrag.js';

  const temp = {};

  export default {
    name: 'intelTargetList',
    props: {
      status: String,
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 5 },
      gridRowStart: { type: Number, default: 2 },
      gridRows: { type: Number, default: 13 },
    },
    data() {
      return {
      }
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
    },
    mounted() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #intelTargetList {
    position: relative; /* to allow for span positioning */
    background-color: rgba(0, 0, 0, .5);
  }
  .margin {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    padding: 4.5vw 3vw;
  }
  .panelGrid {
    display: grid;
    height: 100%;
    grid-template-columns: repeat(8, 12.5%);
    grid-template-rows: repeat(13, 8.3%); /* NOTE: there are actually only 12 rows. 13th row is used to give effect of offscreen */
    background-color: #21292f;
  }
</style>
