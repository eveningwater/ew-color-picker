import util from './util';
/**
 * 绑定事件
 * @param {*} el 
 * @param {*} callback 
 * @param {*} bool 
 */
export function bindEvent(el, callback, bool) {
    const context = this;
    const callResult = event => {
        context.moveX = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
        context.moveY = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
        bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
    }
    const handler = () => {
        const moveFn = e => { e.preventDefault(); callResult(e); }
        const upFn = () => {
            util.off(document, util.eventType[1], moveFn);
            util.off(document, util.eventType[2], upFn);
        }
        util.on(document, util.eventType[1], moveFn);
        util.on(document, util.eventType[2], upFn);
    }
    util.on(el, util.eventType[0], handler);
}