<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { reactive } from '@vue/reactivity';
import ColorPicker from './components/ColorPicker.vue';
const state = reactive({
   config:{
     alpha:true,
     changeColor:(color) => {
       console.log(color)
     }
   }
})
</script>

<template>
    <color-picker :config="state.config"></color-picker>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
