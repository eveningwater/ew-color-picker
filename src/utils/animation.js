import util from './util';
const animation = {};
function TimerManager() {
    this.timers = [];
    this.args = [];
    this.isTimerRun = false;
}
TimerManager.makeTimerManage = function (element) {
    const elementTimerManage = element.TimerManage;
    if (!elementTimerManage || elementTimerManage.constructor !== TimerManager) {
        element.TimerManage = new TimerManager();
    }
};
const methods = [
    {
        method: "add",
        func: function (timer, args) {
            this.timers.push(timer);
            this.args.push(args);
            this.timerRun();
        }
    },
    {
        method: "timerRun",
        func: function () {
            if (!this.isTimerRun) {
                let timer = this.timers.shift(),
                    args = this.args.shift();
                if (timer && args) {
                    this.isTimerRun = true;
                    timer(args[0], args[1]);
                }
            }
        }
    },
    {
        method: "next",
        func: function () {
            this.isTimerRun = false;
            this.timerRun();
        }
    }
];
methods.forEach(method => util.addMethod(TimerManager, method.method, method.func));
function runNext(element) {
    const elementTimerManage = element.TimerManage;
    if (elementTimerManage && elementTimerManage.constructor === TimerManager) {
        elementTimerManage.next();
    }
}
function registerMethods(type, element, time) {
    let transition = '';
    if (type.indexOf('slide') > -1) {
        transition = "height" + time + ' ms';
        util.setCss(element, 'overflow', "hidden");
        upAndDown();
    } else if(type.indexOf('fade') > -1){
        transition = "opacity" + time + ' ms';
        inAndOut();
    }else{
        transition = "display" + time + ' ms';
        showOrHide();
    }
    util.setCss(element, 'transition', transition);
    function upAndDown() {
        const isDown = type.toLowerCase().indexOf('down') > -1;
        if (isDown) util.setCss(element, 'display', 'block');
        const getPropValue = function(item,prop){
            let v = util.getCss(item,prop);
            return util.removeAllSpace(v).length ? parseInt(v) : Number(v);
        }
        const elementChildHeight = [].reduce.call(element.children,(res,item) => {
            res += item.offsetHeight + getPropValue(item,'margin-top') + getPropValue(item,'margin-bottom');
            return res;
        },0);
        let totalHeight = Math.max(element.offsetHeight,elementChildHeight + 10);
        let currentHeight = isDown ? 0 : totalHeight;
        let unit = totalHeight / (time / 10);
        if (isDown) util.setCss(element, 'height', '0px');
        let timer = null;
        let handler = () => {
            currentHeight = isDown ? currentHeight + unit : currentHeight - unit;
            util.setCss(element, 'height', currentHeight + 'px');
            if (currentHeight >= totalHeight || currentHeight <= 0) {
                clearTimeout(timer);
                util.setCss(element, 'height', totalHeight + 'px');
                runNext(element);
            }else{
                timer = setTimeout(handler,10);
            }
            if (!isDown && currentHeight <= 0){
                util.setSomeCss(element, [
                    {
                        prop: "display",
                        value: 'none'
                    },
                    {
                        prop: "height",
                        value:0
                    }
                ]);
            }
        }
        handler();
    }
    function inAndOut() {
        const isIn = type.toLowerCase().indexOf('in') > -1;
        let timer = null;
        let unit = 1 * 100 / (time / 10);
        let curAlpha = isIn ? 0 : 100;
        util.setSomeCss(element, [
            {
                prop: "display",
                value: (isIn ? 'none' : 'block')
            },
            {
                prop: "opacity",
                value: (isIn ? 0 : 1)
            }
        ]);
        let handleFade = function () {
            curAlpha = isIn ? curAlpha + unit : curAlpha - unit;
            if (element.style.display === 'none' && isIn) util.setCss(element, 'display', 'block');
            util.setCss(element, 'opacity', (curAlpha / 100).toFixed(2));
            if (curAlpha >= 100 || curAlpha <= 0) {
                if (timer) clearTimeout(timer);
                runNext(element);
                if (curAlpha <= 0) util.setCss(element, 'display', 'none');
                util.setCss(element, 'opacity', (curAlpha >= 100 ? 1 : 0));
            } else {
                timer = setTimeout(handleFade, 10);
            }
        }
        handleFade();
    }
    function showOrHide(){
        const isShow = type.indexOf('show') > -1;
        setTimeout(() => util.setCss(element,'display',(isShow ? 'block' : 'none')),time);
    }
}
['slideUp', 'slideDown', 'fadeIn', 'fadeOut'].forEach(method => {
    animation[method] = function (element) {
        TimerManager.makeTimerManage(element);
        element.TimerManage.add(function (element, time) {
            return registerMethods(method, element, time);
        }, arguments);
    }
});
['show','hide'].forEach(method => {
    animation[method] = function (element,time) {
        return registerMethods(method, element, time);
    }
})
export default animation;