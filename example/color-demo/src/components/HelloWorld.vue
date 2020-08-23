<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div id="color-picker"></div>
  </div>
</template>

<script>
import ewColorPicker from 'ew-color-picker';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted(){
    new ewColorPicker({
      el:'#color-picker',
      sure:(color) => {
        this.$emit('on-sure-color',color);
      },
      clear:(color) => {
        this.$emit('on-clear-color',color);
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .hello {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 2em;
  }
  .hello > h1 {
    margin-bottom: 15px;
    color:#535455;
  }
</style>
