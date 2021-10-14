<template>
    <div id="app" class="app">
        <ColorPicker :config="colorConfig"></ColorPicker>
    </div>
</template>
<script>
    import ColorPicker from "./components/ColorPicker.vue";
    export default {
        name: "App",
        components:{
            ColorPicker
        },
        data() {
            return {
                colorConfig:{
                    alpha:true,
                    changeColor(color){
                        console.log(color);
                    }
                }
            }
        }
    }
</script>
<style lang="less">
    .app {
        padding: 20px;
    }
</style>