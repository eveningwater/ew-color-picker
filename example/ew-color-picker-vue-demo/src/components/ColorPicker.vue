<template>
    <component :is="componentName" ref="colorPicker"></component>
</template>
<script>
import "ew-color-picker/dist/ew-color-picker.min.css";
import ewColorPicker from "ew-color-picker";
export default {
    name:"ColorPicker",
    props:{
        componentName:{
            type:String,
            default:"div"
        },
        config:{
            type:Object,
            default:() => ({})
        }
    },
    data(){
        return {
            instance:null
        }
    },
    mounted(){
        const instance = this.$refs.colorPicker;
        this.instance = new ewColorPicker({
            ...this.config,
            el:instance
        })
    }
}
</script>