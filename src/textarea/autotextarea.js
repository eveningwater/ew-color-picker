
import { cssObjToStr,isDom,isDeepObject,ewError,getDom,isStr,isUndefined,isNull,getCss,addEvent,oneOf } from '../util/util'

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
            const modeArr = ['auto','notAuto'];
            if(!isStr(option.mode) || !oneOf(modeArr,option.mode))throw ewError('you should pass a string param that called mode and mode is auto or notAuto!');
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
    var isFireFox = document.getBoxObjectFor || 'mozInnerScreenX' in window,
        isOpera = window.opera && window.opera.toString().indexOf('opera');
    el.style.cssText += 'resize:none;';
    var minHeight = parseInt(getCss(el,'height'));
    var contentHeightChange = function () {
        var padding = 0,
            style = el.style,
            currentHeight;
        if (!isFireFox && !isOpera) {
            padding = parseInt(getCss(el,'padding-bottom')) + parseInt(getCss(el,'padding-top'));
        }
        style.height = minHeight + 'px';
        if (el.scrollHeight > minHeight) {
            if (maxHeight && el.scrollHeight > maxHeight) {
                currentHeight = maxHeight - padding;
                style.overflowY = 'auto';
            } else {
                currentHeight = el.scrollHeight - padding;
                style.overflowY = 'hidden';
            }
            style.height = currentHeight + extra + 'px';
        }
    }
    addEvent(el,'propertychange', contentHeightChange)
    addEvent(el,'focus', contentHeightChange);
    addEvent(el,'input', contentHeightChange);
    contentHeightChange();
}
export default ewAutoTextArea;