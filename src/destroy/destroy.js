import util from "../utils/util";

/**
 * 销毁颜色选择器实例
 */
export function destroyInstance(){
    const instance = this.$Dom.rootElement;
    const instanceParentElement = instance.parentElement;
    const isContainer = util.hasClass(instanceParentElement,'ew-color-picker-container');
    if(isContainer && instanceParentElement){
        removeNode(instanceParentElement)
    }else if(instance){
        removeNode(instance);
    }
}
function removeNode(node){
    return node.parentElement.removeChild(node);
}