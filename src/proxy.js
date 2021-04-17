import util from './util';
import Dep from './Dep';
export function defineReactive(target) {
    const dep = new Dep();
    const notify = () => {
        if (Dep.DepTarget) {
            dep.notify();
        }
    };
    let proxy = new Proxy(target, {
        get(target, key, receiver) {
            let val = Reflect.get(target, key, receiver);
            if ( Dep.DepTarget) {
                dep.depend();
            }
            return val;
        },
        set(target, key, receiver) {
            let val = Reflect.set(target, key, receiver);
            notify();
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
                notify();
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
        this.value = value;
        this.reactive = null;
        this.dep = new Dep();
        def(value, '__ob__', this);
        this.walk(value);
    }
    walk(value) {
        this.reactive = defineReactive(value);
    }
}