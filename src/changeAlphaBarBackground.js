import util from './util';
import { colorHsvaToRgba } from './color';
/**
 * 改变透明度
 * @param {*} scope 
 */
 export function changeAlphaBar(scope) {
    if (!scope.alphaBarBg) return;
    let position = scope.config.alphaDirection === 'horizontal' ? 'to right' : 'to top';
    util.setCss(scope.alphaBarBg, 'background', 'linear-gradient('+ position +',' + colorHsvaToRgba(scope.hsvaColor,0) + ' 0%,' + colorHsvaToRgba(scope.hsvaColor,1) + ' 100%)');
}