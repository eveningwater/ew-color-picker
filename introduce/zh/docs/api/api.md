## 默认配置

* 默认配置就是传入一个dom元素或者dom元素字符串，如果不符合这个规则，则在颜色选择器内部会去赋值一个`body`元素字符串，最后将颜色选择器实例渲染到`body`标签中。

如:

```js
const color = new ewColorPicker();
```

```js
const color = new ewColorPicker('div');
```

## 配置对象详解

从1到24是值属性，而24后面的就是方法属性。

### el属性

1.el?(可选属性)

与默认配置一样，传入一个dom元素或者dom元素字符串。如:

```js
const config = {
    el:document.getElementById('demo')
}
const color = new ewColorPicker(config);
```

### alpha属性

2.alpha?(可选属性)

是否开启透明度柱,默认为false。如:

```js
const config = {
    alpha:true
}
const color = new ewColorPicker(config);
```

### hue属性

3.hue?(可选属性)

是否开启色调柱，默认为true。如:

```js
const config = {
    hue:false
}
const color = new ewColorPicker(config);
```

### size属性

4.size?(可选属性)

用于设置色块大小的属性，默认值是`normal`,可以传入`normal,medium,small,mini`这四个字符串值或者一个自定义对象类似`{ width:100,height:50 }`这样的结构，如果传入的不符合规则，则采用默认值，当然要想让这个属性生效必须将`hasBox`属性设置为`true`。如:

```js
const config = {
    size:"mini"
}
const color = new ewColorPicker(config);
```

以下代码无效:

```js
// 由于色块元素直接设置的不显示，所以size属性无效
const config = {
    size:"mini",
    hasBox:false
}
const color = new ewColorPicker(config);
```

### predefineColor属性

5.predefineColor?(可选属性)

预定义颜色数组，可以传入一个字符串数组或者对象数组，结构如:`["#fff"]`和`[{ color:"#fff",disabled:false }]`。颜色选择器内部会去做一次合格的颜色值判断，如果传入的不是合格的颜色值，则不会渲染预定义颜色元素列表。如果想要禁止预定义元素被点击，则需传递对象数组，并将disabled属性设置为true。支持英文单词颜色，hex颜色，hsla颜色模式以及rgba颜色模式。如:

```js
const config = {
    predefineColor:[
        "#fff",
        "red",
        "hsla(123,36%,55%,1)",
        "rgba(233,123,22,.6)"
    ]
}
const color = new ewColorPicker(config);
// 再次实例化一个颜色选择器，DOM元素为id是demo的元素
color.beforeInit("#demo",{
    predefineColor: [
        {
            color:"#fff"
        },
        {
            color:"red",
            disabled:true
        },
        {
            color:"hsla(123,36%,55%,.6)",
            disabled:false
        },
        "rgba(233,123,22,.6)"
    ]
})
```
### disabled属性

6.disabled?(可选属性)

该属性的设置会直接禁用掉颜色选择器的所有点击。默认值是false，是一个布尔值。如:

```js
    const color1 = new ewColorPicker({
        disabled:true,
    });
    const color2 = ewColorPicker.createColorPicker({
        disabled:true,
        hasBox:false
    });
```
### defaultColor属性

7.defaultColor?(可选属性)

该属性是一个字符串值属性，顾名思义，就是定义颜色选择器的默认颜色值，支持颜色选择器所支持的颜色模式，默认值为空。如:

```js
const color = new ewColorPicker({
    defaultColor:"#2396ef",
});
```
### pickerAnimation属性

8.pickerAnimation?(可选属性)

该属性是一个字符串属性，有三个值`default`,`height`或`opacity`,默认值是`default`。表示打开颜色选择器或关闭颜色选择器所执行的动画类型。如:

```js
const color = new ewColorPicker({
    pickerAnimation:"opacity",
});
```

### pickerAnimationTime属性

9.pickerAnimationTime?(可选属性)

该属性是一个数值型属性，可传入任意的数值，但是建议传入的数值大小在`0~1000`以内，否则会很慢才执行动画，所以该属性表示打开或关闭颜色选择器所执行的动画时间。如:

```js
const color = new ewColorPicker({
    pickerAnimationTime:450,
});
```

> 注意:该值有一个最大值，即为10000，如果超过了该值，则实际效果只会按照这个值来执行。

### hasBox属性

10.hasBox?(可选属性)

该属性表示是否显示色块，默认值为true,是一个布尔值。如:

```js
const color = new ewColorPicker({
    hasBox:false,
});

```

### isClickOutside属性

11.isClickOutside?(可选属性)

该属性是一个布尔值，默认值是true，表示是否允许点击颜色面板区域之外关闭颜色面板。如:

```js
const color = new ewColorPicker({
    isClickOutside:false,
});
```

### hasClear属性

12.hasClear?(可选属性)

该属性表示是否显示清空按钮，是一个布尔值，默认值是true。如:

```js
const color = new ewColorPicker({
    hasClear:false,
});
```

### hasSure属性

13.hasSure?(可选属性)

该属性表示是否显示确定按钮，是一个布尔值，默认值是true。如:

```js
const color = new ewColorPicker({
    hasSure:false,
});
```

### hasInput属性

14.hasInput?(可选属性)

该属性表示是否显示输入框，是一个布尔值，默认值是true。如:

```js
const color = new ewColorPicker({
    hasInput:false,
});
```

### boxDisabled属性

15.boxDisabled?(可选属性)

该属性表示是否禁用点击色块元素打开或关闭颜色选择器，是一个布尔值，默认值是false。如:

```js
const color = new ewColorPicker({
    boxDisabled:true,
});
```

> 注意:该属性和disabled属性有所区别，它只是禁用了色块的点击，而disabled属性则是禁用了所有的点击。并且该属性在hasBox为false的情况下失效，因为都没有色块元素了怎么可能还能禁用，所以要想该属性生效，就不能将hasBox属性设置为false。

### openChangeColorMode属性

16.openChangeColorMode?(可选属性)

该属性表示是否开启颜色转换模式，是一个布尔值，默认值是false。请注意该值会修改颜色选择器的布局。如:

```js
const color = new ewColorPicker({
    openChangeColorMode:true,
});
```

> 注意:要开启颜色选择器的颜色转换模式，必须要将`alpha`和`hue`都设置为true，也就是必须要显示透明度柱和色阶柱，否则会在控制台提示错误。

### boxBgColor属性

17.boxBgColor?(可选属性)

该属性表示是否允许色块的背景色随着颜色的改变而改变。也就是说当我们打开颜色选择器面板改变颜色的时候，将该值设置为true，我们就会看到色块的背景色随之而改变。默认值是false。如:

```js
const color = new ewColorPicker({
    boxBgColor:true,
});
```

### hueDirection属性

18.hueDirection?(可选属性)

该属性是一个字符串值的属性，表示色阶柱为横向还是竖向布局。值只能是`horizontal`或`vertical`,默认是`vertical`。如:

```js
const color = new ewColorPicker({
    hueDirection:"horizontal",
});
```

### alphaDirection属性

19.alphaDirection?(可选属性)

该属性同`hueDirection`类似，表示透明度柱为横向还是竖向布局。值只能是`horizontal`或`vertical`,默认是`vertical`。另外需要注意该值生效必须要将`alpha`设置为true。如:


```js
const color = new ewColorPicker({
    alphaDirection:"horizontal",
    alpha:true
});
```

### isLog属性

20.isLog?(可选属性)

该属性表示是否运行在控制台打印颜色选择器相关信息。默认值是true,设置为false将不会在控制台看到颜色选择器的相关信息。如:

```js
const color = new ewColorPicker({
    isLog:false
});
```

### lang属性

21.lang?(可选属性)

该属性表示设置颜色选择器的语言模式，值为"zh"或"en",默认值是"zh"。即中文或英文模式。需要注意如果想要该模式生效，不能将`userDefineText`设置为true。如:

```js
const color = new ewColorPicker({
    lang:"en"
});
```

### clearText属性

22.clearText?(可选属性)

该属性表示清空按钮的文本，默认是"清空"值。如果想要自定义该属性的值，请将`userDefineText`设置为true,但是如果设置了该值之后，`lang`就会无效。如:

```js
const color = new ewColorPicker({
    clearText:"点击清空",
    userDefineText:true
});
```

### sureText属性

23.sureText?(可选属性)

该属性表示清空按钮的文本，默认是"确定"值。如果想要自定义该属性的值，请将`userDefineText`设置为true,但是如果设置了该值之后，`lang`就会无效。如:

```js
const color = new ewColorPicker({
    sureText:"点击确定",
    userDefineText:true
});
```

### userDefineText属性

24.userDefineText?(可选属性)

该属性表示是否自定义按钮的文本值，默认是false。但是如果设置了该值为true之后，`lang`就会无效。如:

```js
const color = new ewColorPicker({
    clearText:"点击清空",
    sureText:"点击确定",
    userDefineText:true
});
```

> 注意:如果将该值设置为true，并且没有设置`clearText`和`sureText`,lang仍然无效，`clearText`和`sureText`仍然是采用的默认值，即自定义传入的lang的时候中文模式下为清空和确定，英文模式下为clear和sure。

> 注意: 从22到23的属性都必须在`hasClear`与`hasSure`都设置为true的情况下生效。


### sure属性

25.sure?(可选属性)

该属性的值是一个函数或者方法，表示点击确定按钮所执行的回调，回调函数有两个参数，第一个是颜色值，第二个则是当前颜色选择器实例对象。如:

```js
const colorPicker = new ewColorPicker({
    sure:(color,context) => {
        console.log('选中的颜色值',color);
        console.log('当前颜色选择器实例对象',context);
    }
});
```

### clear属性

26.clear?(可选属性)

该属性的值是一个函数或者方法，类似`clear`属性，表示点击清空按钮所执行的回调，回调函数有二个参数，第一个是默认颜色值，第二个则是当前颜色选择器实例对象。如:

```js
const colorPicker = new ewColorPicker({
    clear:(defaultColor,context) => {
        console.log('默认的颜色值',defaultColor);
        console.log('当前颜色选择器实例对象',context);
    }
});
```

### togglePicker属性

27.togglePicker?(可选属性)

该属性的值是一个函数或者方法，类似`clear`属性，表示点击色块的回调，回调函数有三个个参数，第一个是颜色选择器的实例化根元素，第二个则是代表当前颜色选择器是打开还是关闭的状态值，为布尔值，第三个则是当前颜色选择器实例对象。如:

```js
const colorPicker = new ewColorPicker({
    togglePicker:(el,flag,context) => {
        console.log('当前根元素',el);
        console.log('当前颜色选择器实例对象',context);
        if(flag){
            console.log("opened");
        }else{
            console.log("closed");
        }
    }
});
```

### changeColor属性

28.changeColor?(可选属性)

该属性的值是一个函数或者方法，类似`clear`属性，表示颜色值改变所触发的回调，回调函数有一个参数，即更改后的颜色值。如:

```js
const colorPicker = new ewColorPicker({
    changeColor:(color) => {
        console.log('颜色值改变',color);
    }
});
```
> 注意:该方法是只要颜色值改变就会触发，例如你传入一个默认颜色值`defaultColor`,也会触发该函数的执行，或者是当有色块盒子的时候，打开颜色选择器的时候也会触发，因为打开颜色选择器的时候也会为颜色面板赋值一个默认颜色值。

## 全局方法

### createColorPicker方法

1.createColorPicker

创建一个颜色选择器实例。如:

```js
const color = ewColorPicker.createColorPicker('div');
```

### getDefaultConfig方法

2.getDefaultConfig

获取颜色选择器的默认配置对象。如:

```js
ewColorPicker.getDefaultConfig();
```
### destroy方法

3.destroy方法

该方法用于全局销毁颜色选择器实例,传入参数为需要消除的颜色选择器实例数组或实例对象。如:

* 消除多个颜色选择器实例

```js
const color1 = ewColorPicker.createColorPicker();
const color2 = ewColorPicker.createColorPicker();
const color3 = new ewColorPicker();
ewColorPicker.destroy([color1,color2,color3]);
```

* 消除单个颜色选择器实例

```js
const color1 = ewColorPicker.createColorPicker();
ewColorPicker.destroy(color1);
```

## 实例属性

### $Dom

1. $Dom

有关颜色选择器的DOM元素集合。如:

```js
const color = new ewColorPicker();
console.log(color.$Dom.pickerInput);//input 元素
```
### config

2. config

颜色选择器的配置对象，属性见前者。例如:

```js
const color = new ewColorPicker();
color.config.togglePicker = function(el,flag,context){
    if(flag){
        console.log("颜色选择器opened");
    }else{
        console.log("颜色选择器closed");
    }
}
```

### 其它

3.其它属性

其它属性不建议使用。如:

```js
const color = new ewColorPicker();
console.log(color.hsvaColor);//{ h:255,s:123,v:111,a:0.5}
```

## 实例方法

实例方法为实例化一个颜色选择器实例之后调用的方法。

### beforeInit方法

1.beforeInit方法

在初始化之前所做的一些操作。如判断配置对象中是否传入一个dom元素。使用这个方法需要传入三个参数，第一个参数为实例化的dom元素，第二个参数为配置对象，第三个参数则为错误信息。如:

```js
const color = new ewColorPicker();
// 如果页面找不到id为demo的DOM元素，则会给出找不到这个DOM元素的错误信息。
color.beforeInit('#demo',{ hasBox:false },"找不到这个dom元素");
```

需要注意的就是，如果手动调用了该方法，相当于重新实例化了一个新的颜色选择器实例，如果传入的dom元素和本身已经实例化的颜色选择器的dom元素一样，则会覆盖第一次实例化的颜色选择器。例如:

```js
const color = new ewColorPicker("#demo");
// 覆盖了第一次实例化的颜色选择器
// 如果页面找不到id为demo的DOM元素，则会给出找不到这个DOM元素的错误信息。
color.beforeInit('#demo',{ hasBox:false },"找不到这个dom元素");
```
后面两个参数是可传可不传的,第二个参数如果传入一个对象，在该方法内部会与默认的配置对象做一次合并，然后第三个参数没有传递的话，则取默认的错误提示信息。而第一个参数如果不传的话，则获取不到元素，方法内部也会报错，错误信息即第三个参数所提示的信息。如:


```js
const color = new ewColorPicker();
// 页面会给出错误提示，找不到这个dom元素
color.beforeInit(null,null,"找不到这个dom元素");
```

### init方法

2.init方法

在`beforeInit`方法之后执行的方法，调用该方法需要传入二个参数，第一个参数为实例化的DOM元素，第二个参数为配置对象。如果没有传入第一个参数或者传入的参数不是一个DOM元素，则会在内部去调用`beforeInit`方法。至于第二个参数不管传不传，都会与颜色选择器的默认配置对象做一次合并，这样将会保证调用该方法不会出现错误。如:

```js
const color = new ewColorPicker();
// 如果找到的div元素是前面实例化的颜色选择器的根元素，则会覆盖前面的颜色选择器
color.init("div",{ hasBox:false });
```

### render方法

3.render方法

顾名思义就是渲染颜色选择器的方法，也是一个核心私有方法，传入二个参数，第一个是一个DOM元素，第二个则是一个配置对象。该方法不建议单独使用，故不作详解,感兴趣可参看[源码](https://github.com/eveningwater/ew-color-picker/blob/master/src/render/render.js)。

### startMain方法

4.startMain方法

颜色选择器的主要逻辑操作都在这个方法中，该方法是一个核心私有方法，也不建议单独使用，故不作详解，感兴趣可参看[源码](https://github.com/eveningwater/ew-color-picker/blob/master/src/layout/main.js)。

### bindEvent方法

5.bindEvent方法

内部拖拽事件的一个封装，该方法有三个参数，第一个参数为需要拖拽的元素，第二个参数为一个回调函数，第三个参数为一个布尔值，如果该值为false，则回调函数将返回四个参数`this对象`,`el`元素,`moveX`,移动的x坐标,`moveY`移动的y坐标，如果为true，则不返回el元素。来看如下一个示例:

```html
<div id="box">
    <div id="demo"></div>
</div>
```

```css
#box {
    width: 200px;
    height: 200px;
    background-color: #f00;
    position: relative;
    margin: 15px;
}
#demo {
    width: 15px;
    height: 15px;
    background-color: #0f0;
    position: absolute;
}
```

```js
const color = new ewColorPicker();
const box = ewColorPicker.util.$("#box");
const demo = ewColorPicker.util.$("#demo");
const util = ewColorPicker.util;
color.bindEvent(demo, (context, el, x, y) => {
    const rect = util.getRect(box);
    const left = Math.max(0, Math.min(x - rect.x, rect.width - 15));
    const top = Math.max(0, Math.min(y - rect.y, rect.height - 15));
    util.setSomeCss(el, [
        {
            prop: "left",
            value: left + 'px'
        },
        {
            prop: "top",
            value: top + 'px'
        }
    ]);
})
```

> 注意:这样使用这个方法不太好，还是使用内置工具方法`bindEvent`好。


### updateColor方法

6.updateColor方法

顾名思义，该方法的含义就是更新颜色值，用于手动去触发颜色选择器的颜色改变，可传入一个颜色值的参数，颜色值必须是一个合格的颜色。如果传入不合格的颜色，那么则会在控制台给出错误提示，并且还要让颜色面板属于开启中的状态，否则会给出错误警告。如:

```js
    const color = new ewColorPicker({
        hasBox:false
    });
    color.updateColor('#2396ef');
```
这在自定义颜色选择器的颜色选择的时候非常有用，例如在vue-cli中，使用input双向绑定来替换掉颜色选择器的默认input框，这时候就需要在input的change事件中调用该方法触发该颜色面板的颜色改变了。如以下一个示例:

<iframe height="265" style="width: 100%;" scrolling="no" title="ew-color-picker" src="https://codepen.io/eveningwater/embed/KKaBreE?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/eveningwater/pen/KKaBreE'>ew-color-picker</a> by eveningwater
  (<a href='https://codepen.io/eveningwater'>@eveningwater</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### openPicker方法

7.openPicker方法

该方法允许传入一个字符串参数和一个数值型参数，用于手动开启颜色选择器面板，这个字符串参数等同pickerAnimation,表示以什么样的动画方式去打开颜色选择器。而数值型参数则表示动画的执行时间，不建议设置的过大，在1000以内即可，因为1000以上会很慢。如:

```js
    const color = new ewColorPicker();
    color.openPicker('height',300);
    //或color.openPicker('opacity',300);
```

### closePicker方法

8.closePicker方法

该方法和`openPicker`方法的参数一样，用于手动关闭颜色选择器。如:

```js
const color = new ewColorPicker();
color.closePicker('height',300);
//或color.closePicker('opacity',300);
```

### destroy方法

9.destroy方法

该方法用于销毁一个颜色选择器实例，不用传任何参数。如:

```js
const color = new ewColorPicker();
color.destroy();
```

## 内置工具方法详解

内置工具方法都被放在`ewColorPicker.util`对象中，一共有`42`个工具方法，可以通过在页面中引入插件的js文件，然后打印这个工具方法对象，下面让我们来看一看都有哪些工具方法吧！

### $方法

1.`$`

获取一个DOM元素，可传入2个参数，第一个参数为DOM元素字符串，第二个参数为获取的DOM元素（如果不传则使用默认参数document元素）。如以下示例代码:

```js
const p = ewColorPicker.util.$('p');
const test = ewColorPicker.util.$('#test');
const element = ewColorPicker.util.$('.element');
```
### `$$`方法

2.`$$`

获取一个NodeList元素集合，可传入2个参数，第一个参数为DOM元素字符串，第二个参数为获取的DOM元素（如果不传则使用默认参数document元素）。如以下示例代码:

```js
const elements = ewColorPicker.util.$$('.element');
```

### addClass方法

3.`addClass`:

顾名思义，该方法就是给元素添加一个类名，有二个参数，第一个参数为DOM元素，第二个参数则为类名字符串。注意这个el元素必须是一个HTMLElement不能是元素集合。如:

```js
    const p = document.querySelector("p");
    ewColorPicker.util.addClass(p,"text");
```

### addMethod方法

4.`addMethod`

该方法有三个参数，第一个参数为一个对象，第二个参数为方法名，第三个参数则为方法函数，表示往该对象实例上添加一个原型方法。如:

```js
    function Test(){}
    const getTest = () => console.log('hello,ewColorPicker!');
    ewColorPicker.util.addMethod(Test,'getTest',getTest);
    //此时你会在Test的原型上看到又一个getTest方法
    const test = new Test();
    test.getTest();//在控制台打印hello,ewColorPicker!
```

### baseClickOutSide方法

5.`baseClickOutSide`方法

顾名思义，该方法就是点击目标区域元素之外执行的操作。例如本颜色选择器中的点击颜色面板之外的区域关闭颜色面板的功能。有三个参数，第一个参数是目标元素，也就是一个DOM元素，第二个元素则是一个布尔值，表示是否在执行回调函数之后解绑事件，默认值是true,第三个参数则是一个回调函数，即点击目标元素区域之外所进行的操作。可以看如下一个示例:

```html
<div id="test"></div>
```

```css
#test{
    width: 200px;
    height: 200px;
    background-color: #ff0;
}
```

```js
const test = document.getElementById("test");
ewColorPicker.util.baseClickOutSide(test,false,() => {
    console.log('点击test元素区域之外触发',test);
});
```

这个功能十分常用。

### bindEvent方法

6.`bindEvent`方法

这个方法和实例上的`bindEvent`（即color.bindEvent）是一样的。例如前面的实例方法中介绍到的示例中的js代码我们可以修改成如下这样:

```js
const box = ewColorPicker.util.$("#box");
const demo = ewColorPicker.util.$("#demo");
const util = ewColorPicker.util;
util.bindEvent(demo, (context, el, x, y) => {
    const rect = util.getRect(box);
    const left = Math.max(0, Math.min(x - rect.x, rect.width - 15));
    const top = Math.max(0, Math.min(y - rect.y, rect.height - 15));
    util.setSomeCss(el, [
        {
            prop: "left",
            value: left + 'px'
        },
        {
            prop: "top",
            value: top + 'px'
        }
    ]);
})
```

这样就实现了一个限定在盒子区域内拖拽改变被拖拽元素位置偏移的功能。

### `colorHexToRgba`方法

7.`colorHexToRgba`方法

该方法就是将一个hex颜色(如:`#fff`)转换成`rgba`颜色。传入二个参数，第一个参数为hex颜色，第二个参数为透明度。如:

```js
ewColorPicker.util.colorHexToRgba("#fff",0.4);
//返回rgba(255,255,255,0.4)
```

### colorHslaToRgba方法

8.`colorHslaToRgba`方法

该方法就是将一个hsla颜色(如:"hsla(123,22%,15%,.3)")转换成`rgba`颜色。传入一个参数，即hsla颜色值对象。如:

```js
ewColorPicker.util.colorHslaToRgba({
    h:123,
    s:22,
    l:15,
    a:.3
});
//返回rgba(30,47,31,0.3)
```

### `colorHsvaToRgba`方法

9.`colorHsvaToRgba`方法

该方法就是将一个hsva颜色转换成rgba颜色。传入二个参数,第一个参数为hsva颜色值对象，第二个参数代表透明度，取值`0~1`。如:

```js
ewColorPicker.util.colorHsvaToRgba({
    h:123,
    s:22,
    v:15,
    a:.3
},.4);
//返回rgba(30,39,31,0.4)
```

### `colorRgbaToHex`方法

10.`colorRgbaToHex`方法

该方法就是将一个rgba颜色转换成hex颜色。传入一个参数，即rgba颜色字符串。如:


```js
ewColorPicker.util.colorRgbaToHex("rgba(123,22,33,.6)");
//返回#7B1621
```

### `colorRgbaToHsla`方法

11.`colorRgbaToHsla`方法

该方法就是将一个rgba颜色转换成hsla颜色。传入一个rgba颜色字符串。如:

```js
ewColorPicker.util.colorRgbaToHsla("rgba(123,22,33,.6)");
//返回{"colorStr":"hsla(354,70%,29%,0.6)","colorObj":{"h":5.891089108910891,"s":0.6965517241379311,"l":0.28431372549019607,"a":0.6}}
```

### `colorRgbaToHsva`方法

12.`colorRgbaToHsva`方法

该方法就是将一个rgba颜色转换成hsva颜色。传入一个rgba颜色字符串。如:

```js
ewColorPicker.util.colorRgbaToHsva("rgba(123,22,33,.6)");
//返回{"h":353.46534653465346,"s":82.11382113821138,"v":48.23529411764706,"a":0.6}
```

### `colorToRgba`方法

13.`colorToRgba`方法

将任意颜色值转换成rgba颜色。传入一个合格的颜色值，如:

```js
ewColorPicker.util.colorToRgba("red");
//返回rgba(255,0,0,1)
ewColorPicker.util.colorToRgba("#fff");
//返回rgba(255,255,255,1)
ewColorPicker.util.colorToRgba("hsla(111,22%,11%,.4)");
//返回rgba(24,34,22,0.4)
```

### `createUUID`方法

14.`createUUID`方法

该方法不用传入任何参数，随机返回一个唯一的`uuid`。如:

```js
    ewColorPicker.util.createUUID();
    //返回类似这样的"20e8-1618715879335-74736"
```
### `deepCloneObjByJSON`方法

15.`deepCloneObjByJSON`方法

该方法用于复制一个对象，传入一个对象参数，由于内部是对`JSON.parse`与`JSON.stringify`方法的封装，因此会有一些缺陷。如:

```js
ewColorPicker.util.deepCloneObjByJSON({ name:"eveningwater"});
//返回{ name:"eveningwater"}
```

### `deepCloneObjByRecursion`方法

16.`deepCloneObjByRecursion`方法

该方法作用等同`deepCloneObjByJSON`，不同的是它的内部是通过递归实现的，所以与`deepCloneObjByJSON`方法也有一些不同。如:

```js
ewColorPicker.util.deepCloneObjByRecursion({ name:"eveningwater"});
//返回{ name:"eveningwater"}
```

### `ewAssign`方法

17.`ewAssign`方法

该方法传入多个对象参数，表示将多个对象合并，作用等同`Object.assign`方法。如:

```js
ewColorPicker.util.ewAssign({ name:"eveningwater"},{ name:"waterXi"});
//返回{ name:"waterXi"}
```

### `ewError`方法

18.`ewError`方法

该方法用于在控制台打印出错误信息。传入一个字符串参数。如:

```js
ewColorPicker.util.ewError("error");
//返回[ewColorPicker warn] Error: error
```

### `ewObjToArray`方法

19.`ewObjToArray`方法

该方法用于将一个类数组转换成真正的数组,传入参数为一个类数组对象。如:

```js
function test(){
    return ewColorPicker.util.ewObjToArray(arguments);
}
test(1,2,3);
//返回[1, 2, 3]
```

### `ewWarn`方法

20.`ewWarn`方法

该方法用于在控制台打印一个警告信息，传入参数为一个字符串。如:

```js
ewColorPicker.util.ewWarn("warning");
//返回[ewColorPicker warn] warning
```

### `getCss`方法

21.`getCss`方法

该方法用于获取一个DOM元素的css样式，传入二个参数，第一个为DOM元素，第二个为获取的css样式属性名。如:

```js
const test = document.getElementById("test")
ewColorPicker.util.getCss(test,"height");
//如果获取到了高度则返回test元素的高度，如高度为100px则返回100px的字符串
```

### `getRect`方法

22.`getRect`方法

该方法用于返回一个DOM元素的坐标相关信息。传入一个DOM元素的参数。如:

```js
const test = document.getElementById("test")
ewColorPicker.util.getRect(test);
//返回类似{x:0,y:0,width:200 ... }类似的结构对象
```

### `hasClass`方法

23.`hasClass`方法

该方法用于判断某个DOM元素是否拥有某些类名。有二个参数，第一个参数为DOM元素，第二个参数为一个类名数组或者一个类名字符串。如:

```js
const test = document.getElementById("test")
ewColorPicker.util.hasClass(test,"test");
ewColorPicker.util.hasClass(test,["test","demo"]);
//返回true或者false
```

### `isAlphaColor`方法

24.`isAlphaColor`方法

判断一个颜色值是否是含有透明度的颜色。传入一个颜色值参数。如:

```js
ewColorPicker.util.isAlphaColor("#fff");
//返回false
ewColorPicker.util.isAlphaColor("rgba(255,222,11,.4)");
//返回true
```

### `isBoolean`方法

25.`isBoolean`方法

判断传入的值是否是一个布尔值。如:

```js
ewColorPicker.util.isBoolean("#fff");
//返回false
ewColorPicker.util.isBoolean(false);
//返回true
```

### `isDeepArray`方法

26.`isDeepArray`方法

判断传入的值是否是一个数组。如:

```js
ewColorPicker.util.isDeepArray("#fff");
//返回false
ewColorPicker.util.isDeepArray([]);
//返回true
```

### `isDeepObject`方法

27.`isDeepObject`方法

判断传入的值是否是一个对象。如:

```js
ewColorPicker.util.isDeepObject(1);
//返回false
ewColorPicker.util.isDeepObject([]);
//返回false
ewColorPicker.util.isDeepObject({});
//返回true
```

### `isDeepRegExp`方法

28.`isDeepRegExp`方法

判断传入的值是否是一个正则表达式。如:


```js
ewColorPicker.util.isDeepRegExp(1);
//返回false
ewColorPicker.util.isDeepRegExp([]);
//返回false
ewColorPicker.util.isDeepRegExp(/123/g);
//返回true
```

### `isDom`方法

29.`isDom`方法

判断传入的值是否是一个DOM元素。如:

```js
ewColorPicker.util.isDom(1);
//返回false
ewColorPicker.util.isDom(document.querySelectorAll('div'));
//返回true
ewColorPicker.util.isDom(document.getElementById("demo"));
//返回true
```

### `isFunction`方法

30.`isFunction`方法

判断传入的值是否是一个函数。如:

```js
ewColorPicker.util.isFunction(123);
//返回false
ewColorPicker.util.isFunction(function(){ console.log('是一个函数')});
//返回true
ewColorPicker.util.isFunction(() => {});
//返回true
```

### `isJQDom`方法

31.isJQDom方法

判断传入的值是否是一个jq对象。如:

```js
ewColorPicker.util.isJQDom(123);
//返回false
ewColorPicker.util.isJQDom($(".test"));
//如果引入了jquery,并且能找到类名为test的dom元素，则返回true
```

### `isNull`方法

32.`isNull`方法

判断传入的值是否是一个null值。如:

```js
ewColorPicker.util.isNull(123);
//返回false
ewColorPicker.util.isNull(null);
//返回true
```

### `isNumber`方法

33.`isNumber`方法

判断传入的值是否是一个数值。如:

```js
ewColorPicker.util.isNumber(123);
//返回true
ewColorPicker.util.isNumber(null);
//返回false
```

### `isShallowObject`方法

34.`isShallowObject`方法

该方法作用等同`isDeepObject`。表示判断一个值是否是对象，不同的是该方法会将函数数组之类的对象判断为true。如:

```js
ewColorPicker.util.isShallowObject(123);
//返回false
ewColorPicker.util.isShallowObject([]);
//返回true
ewColorPicker.util.isShallowObject({});
//返回true
```

### `isString`方法

35.`isString`方法

判断传入的值是否是一个字符串。如:

```js
ewColorPicker.util.isString(123);
//返回false
ewColorPicker.util.isString('');
//返回true
ewColorPicker.util.isString('aaa');
//返回true
```
 
### `isUndefined`方法

36.`isUndefined`方法

判断传入的值是否是一个undefined值。如:

```js
ewColorPicker.util.isUndefined(123);
//返回false
ewColorPicker.util.isUndefined();
//返回true
ewColorPicker.util.isUndefined(undefined);
//返回true
```

### `isValidColor`方法

37.`isValidColor`方法

判断传入的颜色值是否是一个合格的颜色值。如:

```js
ewColorPicker.util.isValidColor("#fff");
//返回true
ewColorPicker.util.isValidColor("red");
//返回true
ewColorPicker.util.isValidColor("rgba(123,111,22)");
//返回true
```

### `off`方法

38.`off`方法

该方法用于给移除一个事件监听器，传入四个参数，第一个为DOM元素，第二个为事件名，第三个参数为事件监听器，第四个参数为一个布尔值。如:

```js
const test = document.getElementById("test");
const handler = e => console.log(e.target.tagName);
ewColorPicker.util.off(test,'click',handler);
```

### `on`方法

39.`on`方法

该方法用于添加一个事件监听器，参数等同`off`方法。如:

```js
const test = document.getElementById("test");
const handler = e => console.log(e.target.tagName);
ewColorPicker.util.on(test,'click',handler);
```

### `removeAllSpace`方法

40.`removeAllSpace`方法

该方法用于移除一个字符串的所有空白，传入参数即一个字符串。如:

```js
ewColorPicker.util.removeAllSpace("a   b   c");
//返回abc
```

### `removeClass`方法

41.`removeClass`方法

该方法用于移除一个元素的类名。传入二个参数，第一个参数为dom元素，第二个参数为移除的类名字符串。如:

```js
const test = document.getElementById("test");
ewColorPicker.util.removeClass(test,"test");
//移除类名为test的class
```

### `setCss`方法

42.`setCss`方法

该方法用于给一个DOM元素设置样式，传入三个参数，第一个参数为DOM元素，第二个参数为样式名，第三个参数为样式值。如:

```js
const test = document.getElementById("test");
ewColorPicker.util.setCss(test,"width","100px");
```

### `setSomeCss`方法

42.`setSomeCss`方法

该方法用于给一个DOM元素设置多个样式，传入二个参数，第一个参数为DOM元素，第二个参数为样式数组，结构如：`[{ prop,"left",propValue:"10px" }]`;如:

```js
const test = document.getElementById("test");
const left = 0,top = 0;
ewColorPicker.util.setSomeCss(test, [
    {
        prop: "left",
        value: left + 'px'
    },
    {
        prop: "top",
        value: top + 'px'
    }
])
```

## 响应式对象

颜色选择器的配置对象是一个响应式对象，这也就意味着如果修改或者增加或者删除颜色选择器配置对象的属性就会引起颜色选择器的重新渲染。如:

```js
// colorConfig不是响应式对象
const colorConfig = Object.create(null);
const color = new ewColorPicker(colorConfig);
// 从实例上读取的config对象是一个响应式对象，因此增加了alpha属性，则颜色选择器会触发颜色选择器的重新渲染
color.config.alpha = true;
```

这是因为颜色选择器在内部使用`proxy`代理了颜色选择器的配置对象，然后将颜色选择器的配置对象变成了一个响应式对象，当对象的属性改变，则触发颜色选择器的重新渲染。

> 注意:修改属性`el`和`isLog`是无效的，因为颜色选择器内部做了判断，这些属性的改动不会触发颜色选择器的重新渲染。


