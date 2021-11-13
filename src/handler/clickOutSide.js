import util from '../utils/util';
import { setBoxBackground } from '../layout/box';
import { close,getAnimationType } from '../handler/openOrClosePicker';
/**
 * 点击目标元素之外关闭颜色选择器
 * @param {*} context 
 * @param {*} config 
 */
 export function handleClickOutSide(context, config) {
    util.clickOutSide(context, config, () => {
        if(!config.isClickOutside){
            return;
        }
        if (context._privateConfig.pickerFlag) {
            context._privateConfig.pickerFlag = false;
            close(getAnimationType({ config: config }), context.$Dom.picker,config.pickerAnimationTime);
            if(config.hasBox && config.boxBgColor){
                setBoxBackground(context.$Dom.box,config.defaultColor);
            }
        }
    });
}