/*
* 功能:判断是否是一个数值
* params@1:字符串
*/

function isNumber(str) {
    return typeof str === 'number';
}
/*
* 功能:判断是否是一个字符串
* params@1:字符串
*/

function isStr(str) {
    return typeof str === 'string';
}

/*
* 功能:判断是否是一个undefined
* params@1:值
*/

function isUndefined(value) {
    return typeof value === 'undefined';
}

/*
* 功能:判断是否是一个对象
* params@1:对象
*/

function isShallowObject(obj) {
    return obj !== null && typeof obj === 'object';
};
/*
* 功能:判断是否是一个对象
* params@1:对象
*/

function isDeepObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};
/*
* 功能:将类数组对象转换成数组
* params@1:类数组对象
*/
function ObjToArray(obj){
    if(obj.length){
        return Array.prototype.slice.call(obj);
    }
}
/*
* 功能:是否是行内块元素
* params@1:字符串
*/
function isIB(str){
    return str.indexOf('inline-block') > -1;
}
/*
* 功能:是否是默认定位
* params@1:字符串
*/
function isStat(str){
    return str.indexOf('static') > -1;
}
/*
* 功能:是否是相对定位
* params@1:字符串
*/
function isRel(str){
    return str.indexOf('relative') > -1;
}
/*
* 功能:是否是绝对定位
* params@1:字符串
*/
function isAbs(str){
    return str.indexOf('absolute') > -1;
}
/*
* 功能:构造函数
* params@1:配置对象
*/

function ewDrag(option) {
    var config,
        el,
        scopeEl; // 默认配置
    if (isStr(option)) {
        el = this.getDOM(option);
        config = {
            width: window.innerWidth, 
            height: window.innerHeight, 
            isWindow: true
        };
    }else if (isDeepObject(option) && option.el) {
        el = isStr(option.el) ? this.getDOM(option.el) : option.el;
        scopeEl = isStr(option.scopeEl) ? this.getDOM(option.scopeEl) : option.scopeEl; // 配置对象
        config = {
            width: option.width || window.innerWidth, 
            height: option.height || window.innerHeight, 
            scopeEl: option.scopeEl || null, 
            isWindow: typeof option.isWindow !== "undefined" ? option.isWindow : true, 
            origin: option.origin || false
        }; // 限制拖拽
        if (config.scopeEl) {
            config.scopeEl = scopeEl.length ? scopeEl[0] : scopeEl;
            config.width = this.getCss(config.scopeEl, "width");
            config.height = this.getCss(config.scopeEl, "height");
        }
        if (option.axis) config.axis = option.axis;
    }
    else {
        return;
    }
    this.beforeInit(el, config);
    this.config = config;
    return this;
}

/*
* 功能:初始化前的一些配置设置
* params@1:元素字符串
*/

ewDrag.prototype.beforeInit = function (el, config) {
    //判断是单个还是多个拖动元素
    if (el && el.length > 0) {
        for (var j = 0,len = el.length;j < len;j++) {
            this.init(this.assign(config, {el: el[j] }));
            this.resize(this,this.assign(config, {el: el[j] }));
        }
    }else {
        config.el = el;
        this.init(config);
        this.resize(this, config);
    }
}

/*
* 功能:获取dom元素
* params@1:元素字符串
*/

ewDrag.prototype.getDOM = function (ident) {
    var selector,
        sType = ident.slice(0, 1),
        identTxt = ident.slice(1);
    if (/^[#\.]/.test(sType)) {
        if (sType == "#") {
            selector = document.getElementById(identTxt);
        }
        else if (sType == ".") {
            selector = document.getElementsByClassName(identTxt);
        }
    }
    else {
        selector = document.getElementsByTagName(ident);
    }
    return selector;
};
/*
* 功能:窗口拖动
* params@1:作用域
* params@2：配置对象
*/

ewDrag.prototype.resize = function (context, params) {
    window.onresize = function () {
        params.width = window.innerWidth;
        params.height = window.innerHeight;
        context.init(params);
    };
};
/*
* 功能:初始化拖拽事件
* params@1:配置属性对象
*/

ewDrag.prototype.init = function (obj) {
    obj.width = parseInt(obj.width) <= parseInt(this.getCss(obj.el, "width")) ? window.innerWidth : parseInt(obj.width);
    obj.height = parseInt(obj.height) <= parseInt(this.getCss(obj.el, "height")) ? window.innerHeight : parseInt(obj.height);
    this.onMouseDown(obj);
};

/*
* 功能:合并对象
* params@1:源数据对象
* params@2~...:多个对象
*/

ewDrag.prototype.assign = function (target, args) {
    if (target === null) return;
    if (Object.assign) {
        return Object.assign(target, args);
    }
    else {
        var _ = Object(target);
        for (var j = 1;j < arguments.length;j++) {
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
* 功能:获取css属性值
* params@1:元素对象
* params@2:css属性名
*/

ewDrag.prototype.getCss = function (el, prop) {
    return el.currentStyle ? el.currentStyle[prop] : window.getComputedStyle(el, null)[prop];
};
/*
* 功能:鼠标按下
* params@1:配置对象
*/

ewDrag.prototype.onMouseDown = function (option) {
    var el = option.el;
    var pos = this.getCss(el, "position");
    el.onmousedown = function (e) {
        var disX = e.clientX - el.offsetLeft;
        var disY = e.clientY - el.offsetTop;
        el.style.cursor = "move";
        this.onMouseMove(el, pos, option, disX, disY);
        this.onMouseUp(el, option);
    }.bind(this);
};
/*
* 功能:鼠标拖动
* params@1:拖动元素
* params@2:设置的浮动属性
* params@3:配置对象
* params@4:当前拖动元素左偏移量
* params@5:当前拖动元素右偏移量
*/

ewDrag.prototype.onMouseMove = function (el, pos, option, disX, disY) {
    document.onmousemove = function (e) {
        el.style.cssText = isStat(pos) ? 'position:absolute;margin:0;' : 'margin:0;';
        var moveX = e.clientX - disX,
            limitX = option.width - el.offsetWidth;
        var moveY = e.clientY - disY,
            limitY = option.height - el.offsetHeight;
        if (option.axis) {
            if (option.axis.toLowerCase().indexOf('x') > -1) {
                this.moveLeft(el, option, moveX, limitX);
            }else if (option.axis.toLowerCase().indexOf('y') > -1) {
                this.moveTop(el, option, moveY, limitY);
            }else {
                throw new Error('a Invalid value of axis!');
            }
        }
        else {
            this.moveLeft(el, option, moveX, limitX);
            this.moveTop(el, option, moveY, limitY);
        }
    }.bind(this);
};
/*
* 功能:还原left偏移量
* params@1:元素
*/

ewDrag.prototype.restoreX = function (el) {
    var timer = null;
    var speed = parseInt(el.style.left);
    el.style.transition = 'left .3s ease-out .1s';
    var clearValue = function () {
        speed -= 50;
        if (timer && speed <= 0) {
            el.style.left = '';
            clearTimeout(timer);
        }
        else {
            timer = setTimeout(clearValue, 100)
        }
    }
    clearValue();
}

/*
* 功能:还原top偏移量
* params@1:元素
*/

ewDrag.prototype.restoreY = function (el) {
    var timer = null;
    var speed = parseInt(el.style.top);
    el.style.transition = 'left .3s ease-out .1s';
    var clearValue = function () {
        speed -= 50;
        if (timer && speed <= 0) {
            el.style.top = '';
            clearTimeout(timer);
        }
        else {
            timer = setTimeout(clearValue, 100)
        }
    }
    clearValue();
}

/*
* 功能:left偏移量
* params@1:元素
* params@2:配置对象
* params@3:移动X轴坐标
* params@4:限制X轴坐标
*/

ewDrag.prototype.moveLeft = function (el, option, moveX, limitX) {
    var left = moveX <= 0 && option.isWindow ? 0 : moveX >= limitX && option.isWindow ? limitX : moveX;
    var defaultLeft = parseInt(this.getCss(el,'left')),
        allLeft = 0,
        isRelative = isRel(this.getCss(el,'position'));
    var children = option.scopeEl.children;
    var elIndex = ObjToArray(children).indexOf(el);
    if(elIndex > 0 && defaultLeft > 0 && isRelative){
        for(var k = 0; k < elIndex;k++){
            allLeft += children[k].offsetWidth;
        }
        // 行内块元素之间的默认间距是否4px有待考究
        el.style.left = left - allLeft - 4 * elIndex + 'px';
    }else{
        el.style.left = left + 'px';
    }
}
/*
* 功能:top偏移量
* params@1:元素
* params@2:配置对象
* params@3:移动y轴坐标
* params@4:限制y轴坐标
*/

ewDrag.prototype.moveTop = function (el, option, moveY, limitY) {
    el.style.top = moveY <= 0 && option.isWindow ? 0 : moveY >= limitY && option.isWindow ? limitY + "px" : moveY + "px";
}

/*
* 功能:鼠标停止拖动
* params@1:元素
* params@2:配置对象
*/

ewDrag.prototype.onMouseUp = function (el, option) {
    document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null; // 还原位置
        if (option.origin) {
            if (option.axis) {
                if (option.axis.toLowerCase().indexOf('x') > -1) {
                    this.restoreX(el);
                }else if (option.axis.toLowerCase().indexOf('y') > -1) {
                    this.restoreY(el);
                }else {
                    throw new Error('a Invalid value of axis!');
                }
            }else {
                this.restoreX(el);
                this.restoreY(el);
            }
            el.style.cssText = 'margin:0;position:"";';
        }
    }.bind(this);
};
window.ewDrag = ewDrag;