
import { pushTarget,popTarget, remove } from './Dep';
import util from './util';
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
        this.cleanDeps();
        let vm = this._colorPickerInstance;
        let config = util.ewAssign(vm.config,{
            boxSize: {
                b_width: null,
                b_height: null
            },
            pickerFlag: false,
            colorValue: "",
        });
        vm.beforeInit(vm.rootElement,config,vm._errorText);
    }
    cleanDeps(){
        if(this.dep){
            this.dep = null;
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