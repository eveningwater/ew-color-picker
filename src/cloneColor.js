import util from './util';
/**
* 克隆颜色对象
* @param {*} color 
*/
export function cloneColor(color) {
    const newColor = util.deepCloneObjByRecursion(color);
    newColor.s = newColor.b = 100;
    return newColor;
}