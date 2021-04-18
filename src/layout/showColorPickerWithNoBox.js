import { open, getHeiAni } from '../handler/openOrClosePicker';
import { setColorValue } from './setColorValue';
import util from '../utils/util';
export function showColorPickerWithNoBox(context) {
    setTimeout(() => {
        const ani = getHeiAni(context);
        context._privateConfig.pickerFlag = true;
        if (util.getCss(context.$Dom.picker, 'display') === 'none') {
            open(ani, context.$Dom.picker, context.config.pickerAnimationTime);
        }
        setColorValue(context, context.panelWidth, context.panelHeight, false);
    }, 0);
}