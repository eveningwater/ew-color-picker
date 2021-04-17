import util from './util';
import { colorHsvaToRgba } from './color';
/**
 * 改变透明度
 * @param {*} scope 
 */
 export function changeAlphaBar(scope) {
    if (!scope.$Dom.alphaBarBg) return;
    let position = scope.isAlphaHorizontal === 'horizontal' ? 'to right' : 'to top';
    util.setCss(scope.$Dom.alphaBarBg, 'background', 'linear-gradient('+ position +',' + colorHsvaToRgba(scope.hsvaColor,0) + ' 0%,' + colorHsvaToRgba(scope.hsvaColor,1) + ' 100%)');
}