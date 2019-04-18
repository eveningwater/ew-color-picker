
import { ewError, isStr, ewAssign, isRel, isStat, ewObjToArray, isDeepObject, isIB, isDeepArray,deepCloneObjByJSON } from './util'
var configArr = [];
/*
* 功能:构造函数
* params@1:配置对象
*/

function ewDrag(option) {
    var config,
        el,
        scopeEl,
        designEl,
        disabledButton;
    // 默认配置
    if (isStr(option)) {
        el = this.getDOM(option);
        config = {
            width: window.innerWidth,
            height: window.innerHeight,
            isWindow: true
        };
    } else if (isDeepObject(option) && option.el) {
        el = isStr(option.el) ? this.getDOM(option.el) : option.el;//拖动元素
        scopeEl = isStr(option.scopeEl) ? this.getDOM(option.scopeEl) : option.scopeEl; // 限制范围元素
        designEl = isStr(option.designEl) ? this.getDOM(option.designEl) : option.designEl;//指定拖动元素
        disabledButton = isStr(option.disabledButton) ? this.getDOM(option.disabledButton) : option.disabledButton;//禁止按钮
        config = {
            width: option.width || window.innerWidth,
            height: option.height || window.innerHeight,
            scopeEl: option.scopeEl || null,
            isWindow: typeof option.isWindow !== "undefined" ? option.isWindow : true,
            origin: option.origin || false,
            designEl: designEl,
            startCB: typeof option.startCB === 'function' ? option.startCB : null,
            moveCB: typeof option.moveCB === 'function' ? option.moveCB : null,
            endCB: typeof option.endCB === 'function' ? option.endCB : null,
            dragDisabled: option.dragDisabled || false,
            disabledButton: disabledButton || null
        };
        // 限制拖拽
        if (config.scopeEl) {
            config.scopeEl = scopeEl.length ? scopeEl[0] : scopeEl;
            config.width = this.getCss(config.scopeEl, "width");
            config.height = this.getCss(config.scopeEl, "height");
        }
        if (option.axis) config.axis = option.axis;
    } else {
        return;
    }
    configArr.push(config);
    this.config = configArr;
    this.beforeInit(el, config);
    if (disabledButton) {
        this.clickDisable(disabledButton, el,config);
    }
    return this;
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
        if (sType === "#") {
            selector = document.getElementById(identTxt);
        }
        else if (sType === ".") {
            selector = document.getElementsByClassName(identTxt);
        }
    }
    else {
        selector = document.getElementsByTagName(ident);
    }
    return selector;
};
/*
* 功能:点击禁用
* params@1:禁用属性
* params@2:拖拽元素
* params@3:配置对象
*/

ewDrag.prototype.clickDisable = function (el,dragEl,config) {
    if (el && el.length > 0) {
        for (var d = 0, len = el.length; d < len; d++) {
            clickEvent(this, el[d]);
        }
    } else {
        clickEvent(this, el);
    }
    function clickEvent(scope, ele) {
        if (!ele) return;
        ele.onclick = function () {
            if (scope.config.length > 1) {
                scope.config.forEach(function (con) {
                    if (ewObjToArray(con.disabledButton).indexOf(ele) > -1) {
                        con.dragDisabled = !con.dragDisabled;
                        scope.beforeInit(con.el, con);
                    }
                })
            }else if(dragEl.length > 0){
                scope.config[0].dragDisabled = !scope.config[0].dragDisabled;
                ewObjToArray(dragEl).forEach((drag) => {
                    scope.beforeInit(drag,scope.config[0]);
                })
            }else {
                config.dragDisabled = !config.dragDisabled;
                scope.beforeInit(config.el, config);
            }
        }
    }
}

/*
* 功能:初始化前的一些配置设置
* params@1:元素字符串
*/

ewDrag.prototype.beforeInit = function (el, config) {
    //判断是单个还是多个拖动元素
    if (el && el.length > 0) {
        for (var j = 0, len = el.length; j < len; j++) {
            this.init(ewAssign(config, { el: el[j] }));
            this.resize(this, ewAssign(config, { el: el[j] }));
        }
    } else {
        config.el = el;
        this.init(config);
        this.resize(this, config);
    }
}

/*
* 功能:窗口拖动
* params@1:作用域
* params@2：配置对象
*/

ewDrag.prototype.resize = function (context, params) {
    window.onresize = function () {
        if (!params.scopeEl) {
            params.width = window.innerWidth;
            params.height = window.innerHeight;
        }
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
    if (option.designEl) {
        if (option.designEl.length > 0) {
            var _this = this;
            ewObjToArray(option.designEl).forEach(function (de) {
                if(_this.config.length > 1){
                    _this.config.map(function(con){
                        if(ewObjToArray(con.designEl).indexOf(de) > -1){
                            mouseDown(_this, con.el, de,con);
                        }
                    })
                }else if(de.parentElement){
                    mouseDown(_this, de.parentElement, de,_this.config[0]);
                }else{
                    mouseDown(_this, option.el, de,_this.config[0]);
                }
            })
        } else {
            mouseDown(this,option.el,option.designEl,option);
        }
    } else {
        mouseDown(this,option.el,option.el,option);
    }
    function setCursor() {
        this.style.cursor = 'move';
    }
    function deleteCursor() {
        this.style.cursor = '';
    }
    function mouseDown(scope,el,element,config) {
        // 禁用拖拽
        if (config.dragDisabled) {
            element.removeEventListener('mouseenter', setCursor);
            element.removeEventListener('mouseleave', deleteCursor);
            element.onmousedown = null;
            document.onmousemove = document.onmouseup = null;
        } else {
            element.addEventListener('mouseenter', setCursor);
            element.addEventListener('mouseleave', deleteCursor);
            element.onmousedown = function (e) {
                if (config.startCB) {
                    config.startCB();
                }
                var disX = e.clientX - el.offsetLeft;
                var disY = e.clientY - el.offsetTop;
                scope.onMouseMove(el,config, disX, disY);
                scope.onMouseUp(el,element,config);
            };
        }
    }
};
/*
* 功能:鼠标拖动
* params@1:拖动元素
* params@2:设置的浮动属性
* params@3:配置对象
* params@4:当前拖动元素左偏移量
* params@5:当前拖动元素右偏移量
*/

ewDrag.prototype.onMouseMove = function (el,option, disX, disY) {
    var pos = this.getCss(el,'position');
    document.onmousemove = function (e) {
        el.style.margin = 0;
        if(isStat(pos)){
            el.style.position = 'absolute';
        }
        if (option.moveCB) {
            option.moveCB();
        }
        var moveX = e.clientX - disX,
            limitX = option.width - el.offsetWidth;
        var moveY = e.clientY - disY,
            limitY = option.height - el.offsetHeight;
        if (option.axis) {
            if (option.axis.toLowerCase().indexOf('x') > -1) {
                this.moveLeft(el, option, moveX, limitX);
            } else if (option.axis.toLowerCase().indexOf('y') > -1) {
                this.moveTop(el, option, moveY, limitY);
            } else {
                throw ewError('a Invalid value of axis!');
            }
        } else {
            this.moveLeft(el, option, moveX, limitX);
            this.moveTop(el, option, moveY, limitY);
        }
    }.bind(this);
};


/*
* 功能:left偏移量
* params@1:元素
* params@2:配置对象
* params@3:移动X轴坐标
* params@4:限制X轴坐标
*/

ewDrag.prototype.moveLeft = function (el, option, moveX, limitX) {
    var left = moveX <= 0 && option.isWindow ? 0 : moveX >= limitX && option.isWindow ? limitX : moveX;
    var defaultLeft = parseInt(this.getCss(el, 'left')),
        allLeft = 0,
        isRelative = isRel(this.getCss(el, 'position'));
    var children = option.el.parentElement.children;
    var elIndex = ewObjToArray(children).indexOf(el);
    var pl_m = parseInt(this.getCss(el.parentElement, 'margin-left'));
    if (elIndex > 0 && defaultLeft && isRelative && children) {
        for (var k = 0; k < elIndex; k++) {
            allLeft += children[k].offsetWidth;
        }
        if (!option.scopeEl) allLeft += pl_m;
        // 行内块元素之间的默认间距是否6px有待考究
        if (isIB) allLeft += 6 * elIndex;
        el.style.left = left - allLeft + 'px';
    } else if (isRelative && !option.scopeEl) {
        el.style.left = left - pl_m + 'px';
    } else {
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
    var isRelative = isRel(this.getCss(el, 'position'));
    var pt_m = parseInt(this.getCss(el.parentElement, 'margin-top'));
    var top = moveY <= 0 && option.isWindow ? 0 : moveY >= limitY && option.isWindow ? limitY : moveY;
    if (isRelative && !option.scopeEl) {
        el.style.top = top - pt_m + 'px';
    } else {
        el.style.top = top + 'px';
    }
}
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
* 功能:鼠标停止拖动
* params@1:元素
* params@2:指定拖拽元素
* params@2:配置对象
*/

ewDrag.prototype.onMouseUp = function (el,element,option) {
    document.onmouseup = function () {
        // 结束回调
        if (option.endCB) {
            option.endCB();
        }
        document.onmousemove = document.onmouseup = null;
        // 鼠标光标还原 
        element.style.cursor = '';
        // 还原位置
        if (option.origin) {
            if (option.axis) {
                if (option.axis.toLowerCase().indexOf('x') > -1) {
                    this.restoreX(el);
                } else if (option.axis.toLowerCase().indexOf('y') > -1) {
                    this.restoreY(el);
                } else {
                    throw ewError('a Invalid value of axis!');
                }
            } else {
                this.restoreX(el);
                this.restoreY(el);
            }
            el.style.cssText = 'margin:0;position:"";';
        }
    }.bind(this);
};

export default ewDrag;