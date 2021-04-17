
import { pushTarget,popTarget, remove } from './Dep';
import util from './util';
import { initError } from './startInit'
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
        popTarget();
        // 每次更新时清空依赖
        this.cleanDeps();
        let vm = this._colorPickerInstance;
        let config = vm.config;
        vm.beforeInit(vm.$Dom.rootElement,vm.config,initError);
    }
    cleanDeps(){
        if(this.dep){
            this.dep.subs = [];
            this.dep = null;
            this.depIds = new Set();
        }
    }
    addDep(dep){
        const id = dep.id;
        if(!this.depIds.has(id)){
            this.depIds.add(id);
            dep.addSub(this);
            this.dep = dep;
        }
    }
}