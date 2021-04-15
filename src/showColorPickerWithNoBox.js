import { open,getHeiAni } from './openOrClosePicker';
import { setColorValue } from './setColorValue';
export function showColorPickerWithNoBox(context) {
    setTimeout(() => {
        context.config.pickerFlag = true;
        open(getHeiAni(context), context.picker);
        setColorValue(context, context.panelWidth, context.panelHeight, false);
    }, 0);
}