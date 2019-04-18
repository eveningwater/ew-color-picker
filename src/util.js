/*
* 功能:判断是否是一个数值
* params@1:字符串
*/
export function isNumber(str) {
    return typeof str === 'number';
}
/*
* 功能:判断是否是一个字符串
* params@1:字符串
*/

export function isStr(str) {
    return typeof str === 'string';
}

/*
* 功能:判断是否是一个undefined
* params@1:值
*/

export function isUndefined(value) {
    return typeof value === 'undefined';
}

/*
* 功能:判断是否是一个对象
* params@1:对象
*/

export function isShallowObject(obj) {
    return obj !== null && typeof obj === 'object';
};
/*
* 功能:判断是否是一个对象
* params@1:对象
*/

export function isDeepObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};

/*
* 功能:判断是否是一个数组
* params@1:对象
*/

export function isDeepArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
};

/*
* 功能:将类数组对象转换成数组
* params@1:类数组对象
*/
export function ewObjToArray(obj) {
    if (obj && obj.length) {
        return Array.prototype.slice.call(obj);
    }
}
/*
* 功能:是否是行内块元素
* params@1:字符串
*/
export function isIB(str) {
    return str.indexOf('inline-block') > -1;
}
/*
* 功能:是否是默认定位
* params@1:字符串
*/
export function isStat(str) {
    return str.indexOf('static') > -1;
}
/*
* 功能:是否是相对定位
* params@1:字符串
*/
export function isRel(str) {
    return str.indexOf('relative') > -1;
}
/*
* 功能:是否是绝对定位
* params@1:字符串
*/
export function isAbs(str) {
    return str.indexOf('absolute') > -1;
}
/*
* 功能:合并对象
* params@1:源数据对象
* params@2~...:多个对象
*/

export function ewAssign(target, args) {
    if (target === null) return;
    if (Object.assign) {
        return Object.assign(target, args);
    } else {
        var _ = Object(target);
        for (var j = 1; j < arguments.length; j++) {
            var source = arguments[j];
            if (source) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        _[key] = source[key];
                    }
                }
            }
        }
        return _;
    }
};

/*
* 功能:错误函数
* params@1:字符串
*/

export function ewError(str) {
    return new Error(str);
}

/*
* 功能:深度克隆对象
* params@1:对象
*/

export function deepCloneObjByJSON(obj) {
    return JSON.parse(JSON.stringify(obj));
}