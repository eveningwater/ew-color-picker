
import { cssObjToStr,isDom,isDeepObject,ewError,getDom,isStr,isUndefined,isNull } from './util'

const defaultTextAreaStyle = {
    'width':'auto',
    "height":'auto',
    'border':'1px solid rgb(169, 169, 169)',
    'min-height':'30px',
    'font':"400 13.3333px Arial;font-family: monospace",
    'min-width':"157px",
    'max-width':"157px",
    'padding':'2px',
    'display':'block',
    "background":"#fff"
}
function ewAutoTextArea(option) {
    if(isDeepObject(option)){
        if(option.el){
            let el = isStr(option.el) ? getDom(option.el) : option.el;
            this.editextArea(el);
        }else{
            let flag = this.isModeUndefined(option.mode) && !this.isModeAuto(option.mode) && !this.isModeNotAuto(option.mode);
            if(flag)throw ewError('you should pass a string param that called mode and mode is auto or notAuto!');
            let container = isStr(option.container) ? getDom(option.container) : isDom(option.container) ? option.container : null;
            this.addTextArea(container,this.createEleAuto(option.mode));
        }
    }else{
        if(isUndefined(option) || isNull(option)){
            this.addTextArea(null,this.createEleAuto('notAuto'))
        }else if(this.isModeAuto(option) || this.isModeNotAuto(option)){
            this.addTextArea(null,this.createEleAuto(option))
        }else{
            let el = isStr(option) ? getDom(option) : option;
            this.editextArea(el);
        }
    }
    return this;
}
/**
* function:edit the tag
* params: the element
*/
ewAutoTextArea.prototype.editextArea = function(element){
    if(element.length){
        for(let e of element){
            this.setEleAuto(e);
        }
    }else{
        this.setEleAuto(element);
    }
}
/**
* function:add the tag
* params: the parent element and the child element
*/
ewAutoTextArea.prototype.addTextArea = function(parent,child){
    if(isDom(parent)){
        if(parent.length){
            for(let p of parent){
                // Due to a child element only has a parent element,here need to clone the child element and repeat using the method of autoTextArea
                let node = child.cloneNode(true);
                if(node.tagName.toLowerCase().indexOf('textarea') > -1)setTimeout(() => { this.autoTextArea(node); },0);
                p.appendChild(node);
            }
        }else{
            parent.appendChild(child);
        }
    }else{
        document.body.appendChild(child)
    }
}
/**
* function:judege the type
* params: the type string
*/
ewAutoTextArea.prototype.isModeUndefined = function(str){
    return !isStr(str);
}
/**
* function:judege the type
* params: the type string
*/
ewAutoTextArea.prototype.isModeAuto = function(str){
    return str.indexOf('auto') > -1;
}
/**
* function:judege the type
* params: the type string
*/
ewAutoTextArea.prototype.isModeNotAuto = function(str){
    return str.indexOf('notAuto') > -1;
}
/**
* function:set a auto tag
* params: the dom element
*/
ewAutoTextArea.prototype.setEleAuto = function(ele){
    if(ele.tagName.toLowerCase().indexOf('textarea') > -1){
        this.autoTextArea(ele)
    }else{
        ele.setAttribute('contenteditable',true);
        ele.style.cssText += cssObjToStr(defaultTextAreaStyle);
    }
}
/**
* function:create a auto textarea tag
* params: the type of tag
*/
ewAutoTextArea.prototype.createEleAuto = function(type){
    let tag = null;
    let autoContent = function(el){
        this.autoTextArea(el);
    }.bind(this);
    if(this.isModeAuto(type)){
        tag = document.createElement('textarea');
        setTimeout(autoContent(tag),0);
    }else{
        tag = document.createElement('div');
        tag.style.cssText += cssObjToStr(defaultTextAreaStyle);
        tag.classList.add('ew-textarea');
        tag.setAttribute('contenteditable',true);
    }
    return tag;
}
/**
* function: 元素自适应
* @param {*} el (输入框dom元素)
* @param {*} extra (光标与输入框的距离,默认是0)
* @param {*} maxHeight (输入框最大高度)
*/
ewAutoTextArea.prototype.autoTextArea = function (el, extra, maxHeight) {
    extra = extra || 0;
    var isFireFox = document.getBoxObjectFor || 'mozInnerScreenX' in window,//是否火狐浏览器
        isOpera = window.opera && window.opera.toString().indexOf('opera');//是否opera浏览器
    //添加事件主流浏览器与IE浏览器的事件
    var addEvent = function (eventName, callback) {
        el.addEventListener ? el.addEventListener(eventName, callback, false) : el.attachEvent('on' + eventName, callback);
    }
    // 获取元素的属性值。参数css属性名，如height
    var getStyle = el.currentStyle ? function (prop) {
        var propName = el.currentStyle[prop];
        if (propName.indexOf('height') > -1 && propName.search(/px/i) > -1) {
            var rect = el.getBoundingClientRect;//获取dom元素边框的所有位置属性
            //元素边框底部位置减去顶部边框位置减去上下内边距，就是获取到的元素的实际高度(IE标准盒子模型)
            return rect.bottom - rect.top - parseInt(getStyle('padding-bottom')) - parseInt(getStyle('padding-top')) + 'px';
        }
    } : function (prop) {
        // 主流浏览器通过getComputedStyle()即可返回元素实际属性值,只返回高度
        return window.getComputedStyle(el, null)[prop];
    };
    //设置resize属性
    el.style.cssText += 'resize:none;';
    //输入框的最小高度
    var minHeight = parseInt(getStyle('height'));
    // 实际内容被改变
    var contentHeightChange = function () {
        // 默认内边距为0，元素滚动距离顶部的距离，设置元素的样式
        var padding = 0,
            style = el.style,
            currentHeight;
        //如果不是火狐浏览器也不是opera浏览器，则内边距等于上下边距相加
        if (!isFireFox && !isOpera) {
            padding = parseInt(getStyle('padding-bottom')) + parseInt(getStyle('padding-top'));
        }
        //文本框初始高度就为最小高度
        style.height = minHeight + 'px';
        //如果滚动高度大于了最小高度
        if (el.scrollHeight > minHeight) {
            //如果最大高度存在，且滚动高度大于最大高度
            if (maxHeight && el.scrollHeight > maxHeight) {
                //当前高度为最大高度减去内边距
                currentHeight = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                //当前高度等于滚动高度减去内边距
                currentHeight = el.scrollHeight - padding;
                style.overflowY = 'hidden';
            }
            //元素高度就等于当前高度加上光标与元素之间的距离
            style.height = currentHeight + extra + 'px';
        }
    }
    addEvent('propertychange', contentHeightChange)//除非表单元素被禁止，否则就会触发该事件，功能类似input事件
    addEvent('focus', contentHeightChange);
    addEvent('input', contentHeightChange);
    contentHeightChange();
}
export default ewAutoTextArea;