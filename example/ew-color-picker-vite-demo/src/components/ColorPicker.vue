<template>
    <component :is="componentName" ref="colorPickerRef"></component>
</template>
<script setup>
    import "ew-color-picker/dist/ew-color-picker.min.css";
    import ewColorPicker from "ew-color-picker";
    import { defineProps, onMounted,ref } from "@vue/runtime-core";
    const props = defineProps({
        config:{
            type:Object,
            default:() => ({})
        },
        componentName:{
            type:String,
            default:"div"
        }
    });
    const colorPickerRef = ref(null);
    onMounted(() => {
        if(colorPickerRef.value){
            new ewColorPicker({ el:colorPickerRef.value,...props.config });
        }
    })
</script>