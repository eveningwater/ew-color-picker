import util from './util';
import { setBoxBackground } from './box';
import { close,getHeiAni } from './openOrClosePicker';
/**
 * 点击目标元素之外关闭颜色选择器
 * @param {*} context 
 * @param {*} config 
 */
 export function handleClickOutSide(context, config) {
    util.clickOutSide(context, config, () => {
        if (config.pickerFlag) {
            config.pickerFlag = false;
            close(getHeiAni({ config: config }), context.picker);
            if(config.hasBox && config.changeBoxByChangeColor){
                setBoxBackground(context.box,config.defaultColor);
            }
        }
    });
}