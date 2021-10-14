import { createRef,useEffect } from "react";
import ewColorPicker from "ew-color-picker";
import "ew-color-picker/dist/ew-color-picker.min.css";
const ColorPicker = (props) => {
    const { name,colorConfig,...restProps } = props;
    const ComponentName = name || "div";
    const colorPickerRef = createRef();
    useEffect(() => {
        if(colorPickerRef.current){
            new ewColorPicker({...colorConfig,el:colorPickerRef.current });
        }
    },[
        colorConfig,
        colorPickerRef
    ]);
    return (
        <ComponentName {...restProps} ref={colorPickerRef}></ComponentName>
    )
}
export default ColorPicker;