<template>
  <div id="heading" :style="styleObj">
    <span>{{ text }}</span>
  </div>
</template>

<script>
  export default {
    name: 'heading',
    props: {
      text: String,
      gridColumnStart: { type: Number, default: 1 },
      gridColumns: { type: Number, default: 4 },
      gridRowStart: { type: Number, default: 1 },
      gridRows: { type: Number, default: 1 },
    },
    computed: {
      styleObj() {
        return {
          'grid-column-start': this.gridColumnStart,
          'grid-column-end': this.gridColumnStart + this.gridColumns,
          'grid-row-start': this.gridRowStart,
          'grid-row-end': this.gridRowStart + this.gridRows,
        };
      },
    },
    mounted: function() {
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #heading {
    position: relative; /* to allow for span positioning */
  }
  #heading span {
    /* the actual text is vertically centered on parent */
    position: absolute;
    width: 100%;
    height: 5vw;
    line-height: 5vw;
    top: 50%;
    left: 0;
    margin-top: -2.5vw;
    font-size: 3.5vw;
    margin-left: 2vw;
    color: white;
    text-shadow: 0 0 3vw rgba(255, 255, 255, .3);
    text-transform: uppercase;
    font-family: 'Raleway';
    letter-spacing: 0.1vw;
  }
</style>
