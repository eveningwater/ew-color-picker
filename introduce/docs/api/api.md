## default configuration

* The default configuration is to pass in a dom element or a dom element string. If this rule is not met, a `body` element string will be assigned inside the colorPicker, and finally the colorPicker instance will be rendered into the `body` tag.

E.G:

```js
const color = new ewColorPicker();
```

```js
const color = new ewColorPicker('div');
```

## the detail of configuration object

From 1 to 24 is the value property, and the one after 24 is the method property.

### el property

1.el?(Optional property)

Like the default configuration, a dom element or a dom element string is passed in. E.g:

```js
const config = {
    el:document.getElementById('demo')
}
const color = new ewColorPicker(config);
```

### alpha property

2.alpha?(Optional property)

Whether to open the alpha bar, the default is false. E.g:

```js
const config = {
    alpha:true
}
const color = new ewColorPicker(config);
```

### hue property

3.hue?(Optional property)

Whether to open the hue bar, the default is true. E.g:

```js
const config = {
    hue:false
}
const color = new ewColorPicker(config);
```

### size property

4.size?(Optional property)

The property used to set the size of the color block, the default value is `normal`, you can pass in the four string values `normal, medium, small, mini` or a custom object similar to `{ width:100,height:50} `For such a structure, if the incoming does not meet the rules, the default value is used. Of course, if you want this property to take effect, you must set the `hasBox` property to `true`. E.g:

```js
const config = {
    size:"mini"
}
const color = new ewColorPicker(config);
```

The following code is invalid:

```js
// Since the color block elements are not displayed directly, the size property is invalid
const config = {
    size:"mini",
    hasBox:false
}
const color = new ewColorPicker(config);
```

### predefineColor property

5.predefineColor?(Optional property)

Predefined color array, you can pass in a string array or object array, structure E.g: `["#fff"]` and `[{ color:"#fff",disabled:false }]`. The colorPicker will make a qualified color value judgment internally. If the incoming color value is not a qualified color value, the list of predefined color elements will not be rendered. If you want to prohibit the predefined element from being clicked, you need to pass an array of objects and set the disabled property to true. Support English word color, hex color, hsla color mode and rgba color mode. E.g:

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
// Instantiate a colorPicker again, the DOM element is the element whose id is demo
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
### disabled property

6.disabled?(Optional property)

The setting of this property will directly disable all clicks on the colorPicker. The default value is false, which is a Boolean value. E.g:

```js
    const color1 = new ewColorPicker({
        disabled:true,
    });
    const color2 = ewColorPicker.createColorPicker({
        disabled:true,
        hasBox:false
    });
```
### defaultColor property

7.defaultColor?(Optional property)

The property is a string value property. As the name suggests, it defines the default color value of the colorPicker, supports the color mode supported by the colorPicker, and the default value is empty. E.g:

```js
const color = new ewColorPicker({
    defaultColor:"#2396ef",
});
```
### pickerAnimation property

8.pickerAnimation?(Optional property)

The property is a string property with three values `default`, `height` or `opacity`, and the default value is `default`. Indicates the type of animation performed when the colorPicker is turned on or off. E.g:

```js
const color = new ewColorPicker({
    pickerAnimation:"opacity",
});
```

### pickerAnimationTime property

9.pickerAnimationTime?(Optional property)

The property is a numeric property, any value can be passed in, but it is recommended that the value passed in should be within `0~1000`, otherwise it will be slow to execute the animation, so the property represents the execution of turning the colorPicker on or off animation time. E.g:

```js
const color = new ewColorPicker({
    pickerAnimationTime:450,
});
```

> Note: This value has a maximum value, which is 10000. If this value is exceeded, the actual effect will only be executed according to this value.

### hasBox property

10.hasBox?(Optional property)

The property indicates whether to display the color block, the default value is true, which is a boolean value. E.g:

```js
const color = new ewColorPicker({
    hasBox:false,
});

```

### isClickOutside property

11.isClickOutside?(Optional property)

The property is a boolean value, the default value is true, indicating whether to allow clicking outside the color panel area to close the color panel. E.g:

```js
const color = new ewColorPicker({
    isClickOutside:false,
});
```

### hasClear property

12.hasClear?(Optional property)

The property indicates whether to display the clear button, a boolean value, and the default value is true. E.g:

```js
const color = new ewColorPicker({
    hasClear:false,
});
```

### hasSure property

13.hasSure?(Optional property)

The property indicates whether to display the sure button, a boolean value, and the default value is true. E.g:

```js
const color = new ewColorPicker({
    hasSure:false,
});
```

### hasInput property

14.hasInput?(Optional property)

The property indicates whether to display the input, a boolean value, and the default value is true. E.g:

```js
const color = new ewColorPicker({
    hasInput:false,
});
```

### boxDisabled property

15.boxDisabled?(Optional property)

The property indicates whether the element is disabled click on the color block to open or close the colorPicker, is a Boolean value, the default value is false. E.g:

```js
const color = new ewColorPicker({
    boxDisabled:true,
});
```

> Note: This property is different from the disabled property, it just disables the click of the color block, while the disabled property disables all clicks. And the property is invalid when hasBox is false, because there is no color block element, how can it be disabled, so if you want this property to take effect, you cannot set the hasBox property to false.

### openChangeColorMode property

16.openChangeColorMode?(Optional property)

This property indicates whether to enable the color conversion mode. It is a boolean value and the default value is false. Please note that this value will modify the layout of the colorPicker. E.g:

```js
const color = new ewColorPicker({
    openChangeColorMode:true,
});
```

> Note: To enable the color conversion mode of the colorPicker, both `alpha` and `hue` must be set to true, that is, the alpha bar and the hue bar must be displayed, otherwise an error will be prompted in the console.

### boxBgColor property

17.boxBgColor?(Optional property)

This property indicates whether to allow the background color of the color block to change as the color changes. That is to say, when we open the colorPicker panel to change the color, set the value to true, and we will see that the background color of the color block changes accordingly. The default value is false. E.g:

```js
const color = new ewColorPicker({
    boxBgColor:true,
});
```

### hueDirection property

18.hueDirection?(Optional property)

The property is a string-valued property, indicating whether the hue bar is laid out horizontally or vertically. The value can only be `horizontal` or `vertical`, and the default is `vertical`. E.g:

```js
const color = new ewColorPicker({
    hueDirection:"horizontal",
});
```

### alphaDirection property

19.alphaDirection?(Optional property)

This property is similar to `hueDirection`, indicating whether the alpha bar is laid out horizontally or vertically. The value can only be `horizontal` or `vertical`, and the default is `vertical`. In addition, please note that `alpha` value must be set to true. E.g:


```js
const color = new ewColorPicker({
    alphaDirection:"horizontal",
    alpha:true
});
```

### isLog property

20.isLog?(Optional property)

This property indicates whether to run in the console to print information about the colorPicker. The default value is true. If set to false, you will not see information about the colorPicker in the console. E.g:

```js
const color = new ewColorPicker({
    isLog:false
});
```

### lang property

21.lang?(Optional property)

This property represents the language mode of setting the colorPicker, the value is "zh" or "en", and the default value is "zh". That is, Chinese or English mode. Note that if you want this mode to take effect, you cannot set `userDefineText` to true. E.g:

```js
const color = new ewColorPicker({
    lang:"en"
});
```

### clearText property

22.clearText?(Optional property)

The property represents the text of the clear button, and the default is the "清空" value. If you want to customize the value of this property, please set `userDefineText` to true, but if you set this value, `lang` will be invalid. E.g:

```js
const color = new ewColorPicker({
    clearText:"clicked to clear",
    userDefineText:true
});
```

### sureText property

23.sureText?(Optional property)

The property represents the text of the clear button, and the default is the "确定" value. If you want to customize the value of this property, please set `userDefineText` to true, but if you set this value, `lang` will be invalid. E.g:

```js
const color = new ewColorPicker({
    sureText:"click to sure",
    userDefineText:true
});
```

### userDefineText property

24.userDefineText?(Optional property)

This property indicates whether to customize the text value of the button, the default is false. But if the value is set to true, `lang` will be invalid. E.g:

```js
const color = new ewColorPicker({
    clearText:"click to clear",
    sureText:"click to sure",
    userDefineText:true
});
```

> Note: If the value is set to true, and `clearText` and `sureText` are not set, lang is still invalid, `clearText` and `sureText` are still the default values used, that is, the Chinese mode when the incoming lang is customized Below is `清空` and `确定`, and in English mode is `clear` and `sure`.

> Note: The properties from 22 to 23 must be effective when both `hasClear` and `hasSure` are set to true.


### sure property

25.sure?(Optional property)

The value of this property is a function or method, which represents the callback executed when the sure button is clicked. The callback function has two parameters, the first is the color value, and the second is the current colorPicker instance object. E.g:

```js
const colorPicker = new ewColorPicker({
    sure:(color,context) => {
        console.log('selected the color',color);
        console.log('current colorPicker instance',context);
    }
});
```

### clear property

26.clear?(Optional property)

The value of this property is a function or method, similar to the `clear` property, which represents the callback executed when the clear button is clicked. The callback function has two parameters, the first is the default color value, and the second is the current colorPicker instance object. E.g:

```js
const colorPicker = new ewColorPicker({
    clear:(defaultColor,context) => {
        console.log('the default color',defaultColor);
        console.log('current colorPicker instance',context);
    }
});
```

### togglePicker property

27.togglePicker?(Optional property)

The value of this property is a function or method, similar to the `clear` property, which represents the callback of clicking on the color block. The callback function has three parameters. The first is the instantiated root element of the colorPicker, and the second represents the current state value of whether the colorPicker is open or closed,it is a boolean value, and the third is the current colorPicker instance object. E.g:

```js
const colorPicker = new ewColorPicker({
    togglePicker:(el,flag,context) => {
        console.log('current root element',el);
        console.log('current colorPicker instance',context);
        if(flag){
            console.log("opened");
        }else{
            console.log("closed");
        }
    }
});
```

### changeColor property

28.changeColor?(Optional property)

The value of this property is a function or method, similar to the `clear` property, which represents the callback triggered by the color value change. The callback function has one parameter, which is the changed color value. E.g:

```js
const colorPicker = new ewColorPicker({
    changeColor:(color) => {
        console.log('the color changed',color);
    }
});
```
> Note: This method is triggered as long as the color value changes. For example, if you pass in a default color value `defaultColor`, it will also trigger the execution of the function, or when there is a color block box, it will also be triggered when the colorPicker is opened. Triggered, because when the colorPicker is opened, a default color value is assigned to the color panel.

## The global method

### createColorPicker method

1.createColorPicker

create a colorPicker。E.g:

```js
const color = ewColorPicker.createColorPicker('div');
```

### getDefaultConfig method

2.getDefaultConfig

Get the default configuration object of the colorPicker.E.g:

```js
ewColorPicker.getDefaultConfig();
```
### destroy method

3.destroy method

This method is used to destroy the colorPicker instance globally, and the incoming parameter is the array or instance object of the colorPicker instance that needs to be eliminated. E.g:

* destroy some colorPicker

```js
const color1 = ewColorPicker.createColorPicker();
const color2 = ewColorPicker.createColorPicker();
const color3 = new ewColorPicker();
ewColorPicker.destroy([color1,color2,color3]);
```

* destroy a colorPicker

```js
const color1 = ewColorPicker.createColorPicker();
ewColorPicker.destroy(color1);
```

## The instance property

### $Dom

1. $Dom

A collection of DOM elements related to the colorPicker. E.g:

```js
const color = new ewColorPicker();
console.log(color.$Dom.pickerInput);//The input element
```
### config

2. config

The configuration object of the colorPicker, see the former for property. E.g:

```js
const color = new ewColorPicker();
color.config.togglePicker = function(el,flag,context){
    if(flag){
        console.log("the colorPicker opened");
    }else{
        console.log("the colorPicker closed");
    }
}
```

### other

3.Other property

Other properties are not recommended. E.g:

```js
const color = new ewColorPicker();
console.log(color.hsvaColor);//{ h:255,s:123,v:111,a:0.5}
```

## The instance method

The instance method is the method called after instantiating a colorPicker instance.

### beforeInit method

1.beforeInit method

Some operations done before initialization. E.g judging whether a dom element is passed in the configuration object. To use this method, you need to pass in three parameters. The first parameter is the instantiated dom element, the second parameter is the configuration object, and the third parameter is the error message. E.g:

```js
const color = new ewColorPicker();
// If the page cannot find the DOM element whose id is demo, it will give an error message that the DOM element cannot be found.
color.beforeInit('#demo',{ hasBox:false },"can not find the element");
```

It should be noted that if the method is manually called, it is equivalent to re-instantiating a new colorPicker instance. If the dom element passed in is the same as the dom element of the colorPicker that has already been instantiated, the first instance will be overwritten. The colorPicker instantiated at once. E.g:

```js
const color = new ewColorPicker("#demo");
// Override the colorPicker for the first instantiation
// If the page cannot find the DOM element whose id is demo, it will give an error message that the DOM element cannot be found.
color.beforeInit('#demo',{ hasBox:false },"can not find the dom element");
```

The latter two parameters can be passed or not. If the second parameter is passed in an object, it will be merged with the default configuration object inside the method, and then if the third parameter is not passed, the default error message will be used. If the first parameter is not passed, the element will not be obtained, and an error will be reported inside the method. The error message is the information prompted by the third parameter. E.g:


```js
const color = new ewColorPicker();
// The page will give an error message that the dom element cannot be found
color.beforeInit(null,null,"can not find the dom element");
```

### init method

2.init method

The method executed after the `beforeInit` method requires two parameters to be passed in to call the method. The first parameter is the instantiated DOM element, and the second parameter is the configuration object. If the first parameter is not passed in or the passed parameter is not a DOM element, the `beforeInit` method will be called internally. As for the second parameter, whether it is passed or not, it will be merged with the default configuration object of the colorPicker, which will ensure that there will be no errors when calling this method. E.g:

```js
const color = new ewColorPicker();
// If the found div element is the root element of the previously instantiated colorPicker, it will override the previous colorPicker
color.init("div",{ hasBox:false });
```

### render method

3.render method

As the name implies, it is the method of rendering the colorPicker, and it is also a core private method. Two parameters are passed in. The first is a DOM element, and the second is a configuration object. This method is not recommended to be used alone, so it will not be explained in detail. If you are interested, please refer to [source code](https://github.com/eveningwater/ew-color-picker/blob/master/src/render/render.js)。

### startMain method

4.startMain method

The main logical operation of the colorPicker is in this method. This method is a core private method, and it is not recommended to use it alone, so it is not explained in detail. If you are interested, please refer to [source code](https://github.com/eveningwater/ew-color-picker/blob/master/src/layout/main.js)。

### bindEvent method

5.bindEvent method

An encapsulation of the internal drag event. The method has three parameters. The first parameter is the element to be dragged, the second parameter is a callback function, and the third parameter is a Boolean value. If the value is false, then The callback function will return the four parameters `this` object, `el` element, the x coordinate of the movement of `moveX`, and the y coordinate of the movement of `moveY`. If it is true, the el element is not returned. Consider the following example:

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

> Note: It is not good to use this method in this way, it is better to use the built-in tool method `bindEvent`.


### updateColor method

6.updateColor method

As the name implies, the meaning of this method is to update the color value, which is used to manually trigger the color change of the colorPicker. A color value parameter can be passed in, and the color value must be a qualified color. If an unqualified color is passed in, an error message will be given in the console, and the color panel must be in the open state, otherwise an error warning will be given. Such as:

```js
    const color = new ewColorPicker({
        hasBox:false
    });
    color.updateColor('#2396ef');
```

This is very useful when customizing the color selection of the colorPicker. For example, in `vue-cli`, use input two-way binding to replace the default input box of the colorPicker. At this time, you need to call this in the change event of the input. The method triggers the color of the color panel to change. Take the following example:

<iframe height="265" style="width: 100%;" scrolling="no" title="ew-color-picker" src="https://codepen.io/eveningwater/embed/KKaBreE?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/eveningwater/pen/KKaBreE'>ew-color-picker</a> by eveningwater
  (<a href='https://codepen.io/eveningwater'>@eveningwater</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### openPicker method

7.openPicker method

This method allows a string parameter and a numeric parameter to be passed in to manually open the colorPicker panel. This string parameter is equivalent to pickerAnimation, which indicates the animation method to open the colorPicker. The numeric parameter indicates the execution time of the animation. It is not recommended to set it too large. It should be within 1000, because it will be very slow if it is above 1000. E.g:

```js
    const color = new ewColorPicker();
    color.openPicker('height',300);
    //or color.openPicker('opacity',300);
```

### closePicker method

8.closePicker method

This method has the same parameters as the `openPicker` method, which is used to manually close the colorPicker. E.g:

```js
const color = new ewColorPicker();
color.closePicker('height',300);
//or color.closePicker('opacity',300);
```

### destroy method

9.destroy method

This method is used to destroy a colorPicker instance without passing any parameters. E.g:

```js
const color = new ewColorPicker();
color.destroy();
```

## Detailed explanation of built-in tool method

The built-in tool methods are all placed in the `ewColorPicker.util` object. There are a total of`42` tool methods. You can import the plug-in js file in the page, and then print the tool method object. Let’s take a look at them. What are the tool methods!

### $ method

1.`$`

Get a DOM element, you can pass in 2 parameters, the first parameter is the DOM element string, the second parameter is the DOM element obtained (if not passed, the default parameter `document` element is used). Such as the following sample code:

```js
const p = ewColorPicker.util.$('p');
const test = ewColorPicker.util.$('#test');
const element = ewColorPicker.util.$('.element');
```

### `$$`方法

2.`$$`

Get a collection of NodeList elements, you can pass in 2 parameters, the first parameter is the DOM element string, the second parameter is the obtained DOM element (if not passed, the default parameter `document` element is used).Such as the following sample code:

```js
const elements = ewColorPicker.util.$$('.element');
```

### addClass method

3.`addClass`:

As the name suggests, this method is to add a class name to the element, with two parameters, the first parameter is the DOM element, and the second parameter is the class name string. Note that this el element must be an HTMLElement and cannot be a collection of elements. Such as:

```js
    const p = document.querySelector("p");
    ewColorPicker.util.addClass(p,"text");
```

### addMethod method

4.`addMethod`

The method has three parameters, the first parameter is an object, the second parameter is the method name, and the third parameter is the method function, which means to add a prototype method to the object instance. E.g:

```js
    function Test(){}
    const getTest = () => console.log('hello,ewColorPicker!');
    ewColorPicker.util.addMethod(Test,'getTest',getTest);
    //At this point you will see a `getTest` method on the prototype of `Test`
    const test = new Test();
    test.getTest();//Print `hello, ewColorPicker` on the console!
```

### baseClickOutSide method

5.`baseClickOutSide` method

As the name suggests, this method is an operation performed outside the element of the target area. For example, in this colorPicker, click the area outside the color panel to close the function of the color panel. There are three parameters. The first parameter is the target element, which is a DOM element. The second element is a boolean value indicating whether to unbind the event after the callback function is executed. The default value is true, and the third parameter is A callback function, that is, the operation performed by clicking outside the target element area. You can look at the following example:

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
    console.log('Click outside the test element area to trigger',test);
});
```

This feature is very commonly used.

### bindEvent method

6.`bindEvent` method

This method is the same as the `bindEvent` (ie color.bindEvent) on the instance. For example, the js code in the example introduced in the previous example method can be modified as follows:

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

In this way, a function of dragging within the box area to change the position offset of the dragged element is realized.

### `colorHexToRgba` method

7.`colorHexToRgba` method

The method is to convert a hex color (such as: `#fff`) into a `rgba` color. Two parameters are passed in, the first parameter is the hex color, and the second parameter is the transparency. E.g:

```js
ewColorPicker.util.colorHexToRgba("#fff",0.4);
//return rgba(255,255,255,0.4)
```

### colorHslaToRgba method

8.`colorHslaToRgba` method

The method is to convert a hsla color (such as: "hsla(123,22%,15%,.3)") into a `rgba` color. Pass in a parameter, the hsla color value object. E.g:

```js
ewColorPicker.util.colorHslaToRgba({
    h:123,
    s:22,
    l:15,
    a:.3
});
//return rgba(30,47,31,0.3)
```

### `colorHsvaToRgba` method

9.`colorHsvaToRgba` method

The method is to convert a hsva color to rgba color. Pass in two parameters, the first parameter is the hsva color value object, the second parameter represents the transparency, the value is `0~1`. E.g:

```js
ewColorPicker.util.colorHsvaToRgba({
    h:123,
    s:22,
    v:15,
    a:.3
},.4);
//return rgba(30,39,31,0.4)
```

### `colorRgbaToHex` method

10.`colorRgbaToHex` method

The method is to convert a rgba color into a hex color. Pass in a parameter, the rgba color string. E.g:


```js
ewColorPicker.util.colorRgbaToHex("rgba(123,22,33,.6)");
//return #7B1621
```

### `colorRgbaToHsla` method

11.`colorRgbaToHsla` method

The method is to convert a rgba color to hsla color. Pass in an rgba color string. E.g:

```js
ewColorPicker.util.colorRgbaToHsla("rgba(123,22,33,.6)");
//return {"colorStr":"hsla(354,70%,29%,0.6)","colorObj":{"h":5.891089108910891,"s":0.6965517241379311,"l":0.28431372549019607,"a":0.6}}
```

### `colorRgbaToHsva` method

12.`colorRgbaToHsva` method

The method is to convert a rgba color to hsva color. Pass in an rgba color string. E.g:

```js
ewColorPicker.util.colorRgbaToHsva("rgba(123,22,33,.6)");
//return {"h":353.46534653465346,"s":82.11382113821138,"v":48.23529411764706,"a":0.6}
```

### `colorToRgba` method

13.`colorToRgba` method

Convert any color value to rgba color. Pass in a qualified color value, E.g:

```js
ewColorPicker.util.colorToRgba("red");
//return rgba(255,0,0,1)
ewColorPicker.util.colorToRgba("#fff");
//return rgba(255,255,255,1)
ewColorPicker.util.colorToRgba("hsla(111,22%,11%,.4)");
//return rgba(24,34,22,0.4)
```

### `createUUID` method

14.`createUUID` method

The method does not need to pass in any parameters, and randomly returns a unique uuid. E.g:

```js
    ewColorPicker.util.createUUID();
    //return like "20e8-1618715879335-74736"
```
### `deepCloneObjByJSON` method

15.`deepCloneObjByJSON` method

This method is used to copy an object and pass in an object parameter. Since the internal encapsulation of the `JSON.parse` and `JSON.stringify` methods, there will be some defects. E.g:

```js
ewColorPicker.util.deepCloneObjByJSON({ name:"eveningwater"});
//return { name:"eveningwater"}
```

### `deepCloneObjByRecursion` method

16.`deepCloneObjByRecursion` method

The function of this method is the same as `deepCloneObjByJSON`, the difference is that its internal implementation is recursively, so there are some differences from the `deepCloneObjByJSON` method. E.g:

```js
ewColorPicker.util.deepCloneObjByRecursion({ name:"eveningwater"});
//return { name:"eveningwater"}
```

### `ewAssign` method

17.`ewAssign` method

The method passes in multiple object parameters, which means that multiple objects are merged, which is equivalent to the `Object.assign` method. E.g:

```js
ewColorPicker.util.ewAssign({ name:"eveningwater"},{ name:"waterXi"});
//return { name:"waterXi"}
```

### `ewError` method

18.`ewError` method

This method is used to print out error messages on the console. Pass in a string parameter. E.g:

```js
ewColorPicker.util.ewError("error");
//return [ewColorPicker warn] Error: error
```

### `ewObjToArray` method

19.`ewObjToArray` method

This method is used to convert an array-like array into a real array, and the incoming parameter is an array-like object. E.g:

```js
function test(){
    return ewColorPicker.util.ewObjToArray(arguments);
}
test(1,2,3);
//return [1, 2, 3]
```

### `ewWarn` method

20.`ewWarn` method

This method is used to print a warning message on the console, and the incoming parameter is a string. E.g:

```js
ewColorPicker.util.ewWarn("warning");
//return [ewColorPicker warn] warning
```

### `getCss` method

21.`getCss` method

This method is used to obtain the css style of a DOM element, passing in two parameters, the first is the DOM element, and the second is the property name of the obtained css style. E.g:

```js
const test = document.getElementById("test")
ewColorPicker.util.getCss(test,"height");
//If the height is obtained, return the height of the test element, and if height is 100px, return a 100px string
```

### `getRect` method

22.`getRect` method

This method is used to return the coordinate-related information of a DOM element. Pass in the parameters of a DOM element. E.g:

```js
const test = document.getElementById("test")
ewColorPicker.util.getRect(test);
//Return a structure object similar to {x:0,y:0,width:200...}
```

### `hasClass` method

23.`hasClass` method

This method is used to determine whether a DOM element has certain class names. There are two parameters, the first parameter is a DOM element, and the second parameter is an array of class names or a string of class names. E.g:

```js
const test = document.getElementById("test")
ewColorPicker.util.hasClass(test,"test");
ewColorPicker.util.hasClass(test,["test","demo"]);
//return true or false
```

### `isAlphaColor` method

24.`isAlphaColor` method

Determine whether a color value is a color with transparency. Pass in a color value parameter. E.g:

```js
ewColorPicker.util.isAlphaColor("#fff");
//return false
ewColorPicker.util.isAlphaColor("rgba(255,222,11,.4)");
//return true
```

### `isBoolean` method

25.`isBoolean` method

Determine whether the value passed in is a Boolean value. E.g:

```js
ewColorPicker.util.isBoolean("#fff");
//return false
ewColorPicker.util.isBoolean(false);
//return true
```

### `isDeepArray` method

26.`isDeepArray` method

Determine whether the value passed in is a array value. E.g:

```js
ewColorPicker.util.isDeepArray("#fff");
//return false
ewColorPicker.util.isDeepArray([]);
//return true
```

### `isDeepObject` method

27.`isDeepObject` method

Determine whether the value passed in is a object value. E.g:

```js
ewColorPicker.util.isDeepObject(1);
//return false
ewColorPicker.util.isDeepObject([]);
//return false
ewColorPicker.util.isDeepObject({});
//return true
```

### `isDeepRegExp` method

28.`isDeepRegExp` method

Determine whether the value passed in is a RegExp value. E.g:


```js
ewColorPicker.util.isDeepRegExp(1);
//return false
ewColorPicker.util.isDeepRegExp([]);
//return false
ewColorPicker.util.isDeepRegExp(/123/g);
//return true
```

### `isDom` method

29.`isDom` method

Determine whether the value passed in is a dom element. E.g:

```js
ewColorPicker.util.isDom(1);
//return false
ewColorPicker.util.isDom(document.querySelectorAll('div'));
//return true
ewColorPicker.util.isDom(document.getElementById("demo"));
//return true
```

### `isFunction` method

30.`isFunction` method

Determine whether the value passed in is a function value. E.g:

```js
ewColorPicker.util.isFunction(123);
//return false
ewColorPicker.util.isFunction(function(){ console.log('is a function')});
//return true
ewColorPicker.util.isFunction(() => {});
//return true
```

### `isJQDom` method

31.isJQDom method

Determine whether the value passed in is a jQuery object value. E.g:

```js
ewColorPicker.util.isJQDom(123);
//return false
ewColorPicker.util.isJQDom($(".test"));
//If jquery is introduced and the dom element with the class name test can be found, return true
```

### `isNull` method

32.`isNull` method

Determine whether the value passed in is a null value. E.g:

```js
ewColorPicker.util.isNull(123);
//return false
ewColorPicker.util.isNull(null);
//return true
```

### `isNumber` method

33.`isNumber` method

Determine whether the value passed in is a number value. E.g:

```js
ewColorPicker.util.isNumber(123);
//return true
ewColorPicker.util.isNumber(null);
//return false
```

### `isShallowObject` method

34.`isShallowObject` method

This method is equivalent to `isDeepObject`. It means to judge whether a value is an object. The difference is that this method judges objects such as function arrays as true. E.g:

```js
ewColorPicker.util.isShallowObject(123);
//return false
ewColorPicker.util.isShallowObject([]);
//return true
ewColorPicker.util.isShallowObject({});
//return true
```

### `isString` method

35.`isString` method

Determine whether the value passed in is a string. E.g:

```js
ewColorPicker.util.isString(123);
//return false
ewColorPicker.util.isString('');
//return true
ewColorPicker.util.isString('aaa');
//return true
```
 
### `isUndefined` method

36.`isUndefined` method

Determine whether the value passed in is a undefined value. E.g:

```js
ewColorPicker.util.isUndefined(123);
//return false
ewColorPicker.util.isUndefined();
//return true
ewColorPicker.util.isUndefined(undefined);
//return true
```

### `isValidColor` method

37.`isValidColor` method

Determine whether the incoming color value is a qualified color value. E.g:

```js
ewColorPicker.util.isValidColor("#fff");
//return true
ewColorPicker.util.isValidColor("red");
//return true
ewColorPicker.util.isValidColor("rgba(123,111,22)");
//return true
```

### `off` method

38.`off` method

This method is used to remove an event listener and pass in four parameters, the first is the DOM element, the second is the event name, the third parameter is the event listener, and the fourth parameter is a Boolean value. E.g:

```js
const test = document.getElementById("test");
const handler = e => console.log(e.target.tagName);
ewColorPicker.util.off(test,'click',handler);
```

### `on` method

39.`on` method

This method is used to add an event listener, and the parameters are equivalent to the `off` method. E.g:

```js
const test = document.getElementById("test");
const handler = e => console.log(e.target.tagName);
ewColorPicker.util.on(test,'click',handler);
```

### `removeAllSpace` method

40.`removeAllSpace` method

This method is used to remove all blanks in a string, and the incoming parameter is a string. E.g:

```js
ewColorPicker.util.removeAllSpace("a   b   c");
//return abc
```

### `removeClass` method

41.`removeClass` method

This method is used to remove the class name of an element. Pass in two parameters, the first parameter is the dom element, and the second parameter is the removed class name string. E.g:

```js
const test = document.getElementById("test");
ewColorPicker.util.removeClass(test,"test");
//Remove the class named test
```

### `setCss` method

42.`setCss` method

This method is used to set a style for a DOM element, passing in three parameters, the first parameter is the DOM element, the second parameter is the style name, and the third parameter is the style value. E.g:

```js
const test = document.getElementById("test");
ewColorPicker.util.setCss(test,"width","100px");
```

### `setSomeCss` method

43.`setSomeCss` method

This method is used to set multiple styles for a DOM element, passing in two parameters, the first parameter is the DOM element, the second parameter is the style array, the structure such as `[{ prop,"left",propValue:" 10px" }]`. E.g:

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

## reactivity object

The configuration object of the colorPicker is a reactivity object, which means that if the property of the colorPicker configuration object is modified or added or deleted, the colorPicker will be re-rendered. E.g:

```js
// colorConfig is not a reactivity object
const colorConfig = Object.create(null);
const color = new ewColorPicker(colorConfig);
// The config object read from the instance is a reactivity object, so if the alpha property is added, the colorPicker will trigger the re-rendering of the colorPicker
color.config.alpha = true;
```

This is because the colorPicker uses `proxy` internally to proxy the configuration object of the colorPicker, and then turns the configuration object of the colorPicker into a reactivity object. When the property of the object changes, it triggers the re-rendering of the colorPicker.

> Note: Modifying the property `el` and `isLog` is invalid, because the colorPicker has made a judgment internally, and these property changes will not trigger the re-rendering of the colorPicker.


