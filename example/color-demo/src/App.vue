<template>
  <div id="app" :style="{ 'background':color }">
    <img alt="Vue logo" src="./assets/logo.png" class="logo">
    <HelloWorld msg="欢迎使用ew-color-picker!" @on-sure-color="changeBg" @on-clear-color="clearBg"/>
  </div>
</template>

<script>
    import HelloWorld from './components/HelloWorld.vue'

    export default {
        name: 'App',
        data() {
            return {
                color: "#fff"
            }
        },
        mounted() {

        },
        methods: {
            changeBg(color) {
                this.color = color;
            },
            clearBg(color) {
                this.color = color;
            }
        },
        components: {
            HelloWorld
        }
    }
</script>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        flex-direction: column;
    }
</style>