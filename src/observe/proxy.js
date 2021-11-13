import util from '../utils/util';
import Dep from './dep';
const notKeys = ["el","isLog"];
export const isNotKey = key => {
    return notKeys.indexOf(key) === -1;
}
export function defineReactive(dep,target) {
    const notify = k => {
        if (Dep.DepTarget && isNotKey(k)) {
            dep.notify(k);
        }
    };
    let proxy = new Proxy(target, {
        get(target, key, receiver) {
            let val = Reflect.get(target, key, receiver);
            if ( Dep.DepTarget && isNotKey(key)) {
                dep.depend();
            }
            return val;
        },
        set(target, key, receiver) {
            let val = Reflect.set(target, key, receiver);
            notify(key);
            return val;
        },
        has(target, key) {
            if (key in target && !(key in Object.prototype)) {
                return Reflect.has(target, key);
            } else {
                return false;
            }
        },
        deleteProperty(target, key) {
            if (this.has(target, key)) {
                let val = Reflect.deleteProperty(target, key);
                notify(key);
                return val;
            }
        }
    });
    return proxy;
}
function def(obj, key, value, enumerable) {
    Object.defineProperty(obj, key, {
        enumerable: !!enumerable,
        value: value,
        writable: true,
        configurable: true
    })
}
export class Observer {
    constructor(value) {
        this.value = { ...value };
        this.reactive = null;
        this.dep = new Dep();
        // 为了区分于vue,添加独特的标志属性
        def(value, '__ew__color__picker__ob__', this);
        this.walk(this.value);
    }
    walk(value) {
        this.reactive = defineReactive(this.dep,value);
    }
}