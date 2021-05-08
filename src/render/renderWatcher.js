
import { pushTarget, remove } from '../observe/dep';
import util from '../utils/util';
import { initError } from '../init/startInit';
/**
 * 重新渲染颜色选择器
 * @param {*} vm 
 * @param {*} callback 
 */
 export function render(vm,callback){
    setTimeout(() => {
        vm.beforeInit(vm.$Dom.rootElement,vm.config,initError);
        if(util.isFunction(callback))callback();
    },vm.config.pickerAnimationTime);
}
export default class RenderWatcher {
    constructor(vm){
        this._colorPickerInstance = vm;
        this._watcher_id = vm._color_picker_uid;
        this.depIds = new Set();
        this.dep = null;
        vm._watcher = this;
        this.get();
    }
    get(){
        pushTarget(this);
    }
    update(){
        const updateHandler = vm => {
            render(vm,() => this.cleanDeps());
        }
        updateHandler(this._colorPickerInstance);
    }
    cleanDeps(){
        if(this.dep){
            this.dep.subs = [];
        }
    }
    addDep(dep){
        const id = dep.id;
        this.dep = dep;
        if(!this.depIds.has(id)){
            this.depIds.add(id);
            dep.addSub(this);
        }
    }
}