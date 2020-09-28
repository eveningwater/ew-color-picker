import util from './util';
const ani = (function () {
    let animation = {};
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
            let overflow = '';
            if (type.indexOf('slide') > -1) {
                transition = "height" + time + ' ms';
                overflow = 'hidden';
                upAndDown();
            } else {
                transition = "opacity" + time + ' ms';
                overflow = '';
                inAndOut();
            }
            if (overflow) util.setCss(element, 'overflow', overflow);
            util.setCss(element, 'transition', transition);
            function upAndDown() {
                const isDown = type.toLowerCase().indexOf('down') > -1;
                if(isDown)util.setCss(element, 'display', 'block');
                let totalHeight = element.offsetHeight;
                let currentHeight = isDown ? 0 : totalHeight;
                let unit = totalHeight / (time / 10);
                if (isDown)util.setCss(element, 'height', '0px');
                let timer = setInterval(() => {
                    currentHeight = isDown ? currentHeight + unit : currentHeight - unit;
                    util.setCss(element, 'height', currentHeight + 'px');
                    if (currentHeight >= totalHeight || currentHeight <= 0) {
                        clearInterval(timer);
                        util.setCss(element, 'height', totalHeight + 'px');
                        runNext(element);
                    }
                    if (!isDown && currentHeight <= 0) util.setCss(element, 'display', 'none');
                }, 10);
            }
            function inAndOut() {
                const isIn = type.toLowerCase().indexOf('in') > -1;
                let timer = null;
                let unit = 1 * 100 / (time / 10);
                let curAlpha = isIn ? 0 : 100;
                util.setCss(element, 'display', (isIn ? 'none' : 'block'));
                util.setCss(element, 'opacity', (isIn ? 0 : 1));
                let handleFade = function () {
                    curAlpha = isIn ? curAlpha + unit : curAlpha - unit;
                    if (element.style.display === 'none' && isIn) util.setCss(element, 'display', 'block');
                    util.setCss(element, 'opacity', (curAlpha / 100).toFixed(2));
                    if (curAlpha >= 100 || curAlpha <= 0) {
                        if (timer) clearTimeout(timer);
                        runNext(element);
                        if (curAlpha <= 0) util.setCss(element, 'display', 'none');
                        util.setCss(element, 'opacity', (curAlpha >= 100 ? 1 : 0));
                    }else{
                        timer = setTimeout(handleFade, 10);
                    }
                }
                handleFade();
            }
    }
    ['slideUp', 'slideDown', 'fadeIn', 'fadeOut'].forEach(method => {
        animation[method] = function (element) {
            TimerManager.makeTimerManage(element);
            element.TimerManage.add(function (element, time) {
                return registerMethods(method,element,time);
            }, arguments);
        }
    });
    return animation;
})();
export default ani;