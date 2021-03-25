import util from './util';
import { colorHSBaToRgba } from './color';
/**
 * 改变透明度
 * @param {*} scope 
 */
 export function changeAlphaBar(scope) {
    if (!scope.alphaBarBg) return;
    util.setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHSBaToRgba(scope.hsbColor,0) + ' 0%,' + colorHSBaToRgba(scope.hsbColor,1) + ' 100%)');
}