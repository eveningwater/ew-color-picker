import util from '../utils/util';
/**
* 克隆颜色对象
* @param {*} color 
*/
export function cloneColor(color) {
    const newColor = util.deepCloneObjByRecursion(color);
    newColor.s = newColor.v = 100;
    return newColor;
}