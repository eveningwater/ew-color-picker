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

顾名思义就是渲染颜色选择器的方法，该方法不建议单独使用，故不作详解,感兴趣可参看[源码](https://github.com/eveningwater/ew-color-picker/blob/master/src/render.js)。

### startMain方法

4.startMain方法

颜色选择器的主要逻辑操作都在这个方法中，该方法也也不建议单独使用，故不作详解，感兴趣可参看[源码](https://github.com/eveningwater/ew-color-picker/blob/master/src/main.js)。

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


### 
## 内置工具方法详解

内置工具方法都被放在`ewColorPicker.util`对象中，一共有`41`个工具方法，可以通过在页面中引入插件的js文件，然后打印这个工具方法对象，下面让我们来看一看都有哪些工具方法吧！

### $方法

1.`$`

获取一个DOM元素，传入一个字符串参数，如果传入类似`#demo`的DOM元素字符串，则会返回一个DOM元素，如果是其它则会返回一个DOM元素集合（PS：当然必须要查询到DOM元素，如果没有查询到则返回null）。如以下示例代码:

```js
const p = ewColorPicker.util.$('p');
const test = ewColorPicker.util.$('#test');
const elements = ewColorPicker.util.$('.element');
```

### addClass方法

2.`addClass`:

顾名思义，该方法就是给元素添加一个类名，有二个参数，第一个参数为DOM元素，第二个参数则为类名字符串。注意这个el元素必须是一个HTMLElement不能是元素集合。如:

```js
    const p = document.querySelector("p");
    ewColorPicker.util.addClass(p,"text");
```

### addMethod方法

3.`addMethod`

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

4.`baseClickOutSide`方法

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

这个功能和常用。

### bindEvent方法

5.`bindEvent`方法

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


