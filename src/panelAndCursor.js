import { changeElementColor } from './changeElementColor';
import util from './util';
/**
 * 拖拽
 * @param {*} scope 
 * @param {*} left 
 * @param {*} top 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
 export function changeCursorColor(scope, left, top, panelWidth, panelHeight) {
    util.setSomeCss(scope.pickerCursor, [{ prop: 'left', value: left + 'px' }, { prop: 'top', value: top + 'px' }])
    const s = parseInt(100 * (left - 4) / panelWidth);
    const v = parseInt(100 * (panelHeight - (top - 4)) / panelHeight);
    //需要减去本身的宽高来做判断
    scope.hsvaColor.s = s > 100 ? 100 : s < 0 ? 0 : s;
    scope.hsvaColor.v = v > 100 ? 100 : v < 0 ? 0 : v;
    scope.boxChange = true;
    changeElementColor(scope);
}


/**
 * 点击面板改变
 * @param {*} scope 
 * @param {*} eve 
 */
export function onClickPanel(scope, eve) {
    if (eve.target !== scope.pickerCursor) {
        //临界值处理
        const moveX = eve.layerX;
        const moveY = eve.layerY;
        const panelWidth = scope.pickerPanel.offsetWidth;
        const panelHeight = scope.pickerPanel.offsetHeight;
        const left = moveX >= panelWidth - 1 ? panelWidth : moveX <= 0 ? 0 : moveX;
        const top = moveY >= panelHeight - 2 ? panelHeight : moveY <= 0 ? 0 : moveY;
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight)
    }
}