
let depId = 0;
export function remove(array,item){
    if(array.length){
        let idx = array.indexOf(item);
        if(idx > -1){
            return array.splice(idx,1);
        }
    }
}
export default class Dep {
    static id = depId;
    static subs = [];
    constructor(){
        this.id = depId++;
        this.subs = [];
    }
    addSub(sub){
        this.subs.push(sub);
    }
    removeSub(sub){
        remove(this.subs,sub);
    }
    notify(){
        const subs = this.subs.slice();
        for(let i = 0,len = subs.length;i < len;i++){
            subs[i].update();
        }
    }
    depend(){
        if(Dep.DepTarget){
            Dep.DepTarget.addDep(this);
        }
    }
}
Dep.DepTarget = null;
export function pushTarget(watcher){
    Dep.DepTarget = watcher;
}
export function popTarget(){
    Dep.DepTarget = null;
}