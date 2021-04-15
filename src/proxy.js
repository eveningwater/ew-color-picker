import util from './util';
import Dep from './Dep';
export function defineReactive(target,key){
    const dep = new Dep();
    let val = target[key];
    Object.defineProperty(target,key,{
        enumerable:true,
        configurable:true,
        get(value){
            if(Dep.DepTarget){
                dep.depend();
            }
            return val;
        },
        set(newVal){
            if(newVal === val){
                return;
            }
            val = newVal;
            if(Dep.DepTarget){
                dep.notify();
            }
        }
    })
}
function def(obj,key,value,enumerable){
    Object.defineProperty(obj,key,{
        enumerable:!!enumerable,
        value:value,
        writable:true,
        configurable:true
    })
}
export class Observer {
    constructor(value){
        this.value = value;
        this.dep = new Dep();
        def(value,'__ob__',this);
        this.walk(value);
    }
    walk(value){
        let keys = Object.keys(value);
        const notKeys = ['isClickOutside',"colorValue","boxSize","pickerFlag","boxSize"];
        for(let i = 0,len = keys.length;i < len;i++){
            if(!util.isFunction(keys[i]) && notKeys.indexOf(keys[i]) === -1){
                defineReactive(value,keys[i]);
            }
        }
    }
}