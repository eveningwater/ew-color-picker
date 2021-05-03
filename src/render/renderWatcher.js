
import { pushTarget, remove } from '../observe/dep';
import util from '../utils/util';
import { initError } from '../init/startInit';
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
            setTimeout(() => {
                vm.beforeInit(vm.$Dom.rootElement,vm.config,initError);
                // 每次更新时清空依赖
                this.cleanDeps();
            },vm.config.pickerAnimationTime);
        }
        if(this.depIds.size === 1 || !this.dep.subs.length){
            updateHandler(this._colorPickerInstance);
        }else{
            // 渲染的依赖有点奇怪?
            const dep = this.dep.subs.filter(_ => _._watcher_id !== this._watcher_id)[0];
            updateHandler(dep._colorPickerInstance);
        }
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