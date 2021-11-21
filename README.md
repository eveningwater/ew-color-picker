
[English](./README.md) | [简体中文](./README-zh_CN.md)

# ew-color-picker

[![NPM version](https://img.shields.io/npm/v/ew-color-picker.svg?color=red)](https://www.npmjs.com/package/ew-color-picker)
![npm](https://img.shields.io/npm/dw/ew-color-picker)
![npm](https://img.shields.io/npm/dt/ew-color-picker)
[![GitHub stars](https://img.shields.io/github/stars/eveningwater/ew-color-picker.svg?color=#42b983)](https://github.com/eveningwater/ew-color-picker/stargazers)
[![GitHub stars](https://img.shields.io/github/forks/eveningwater/ew-color-picker.svg)](https://github.com/eveningwater/ew-color-picker/network/members)

A colorPicker plugin packaged based on native js.

## Installation and use

### Installation
```
  npm install ew-color-picker --save-dev // or yarn add ew-color-picker

```
### import

```js
  <script src="./dist/ew-color-picker.min.js"></script>

```

A colorPicker as follows:

```js
   //default configuration
   var color = new ewColorPicker('.demo');
   // or var color = new ewColorPicker(document.getElementByClassName('demo'));
   //click the sure button
   color.config.sure = function(color){
       //return color value
   }
   //click the cancel button
   color.config.clear = function(defaultColor){
     //return default color value
   }
  //  when the color changed
  color.config.changeColor = function(color){
     //return the changed color
  }
     //Custom configuration
   var color = new ewColorPicker({
      el:'.demo2',//the dom element
      alpha:true,//open the alpha
      hue:false,//open the hue
      size:{
          width:100,
          height:50
      },//the colorPicker type，contained four value such as normal,medium,small,mini or an object that you defined by yourself,the min value is 25px
      predefineColor:['#223456','rgba(122,35,77,.5)'],//predefine color is an array
      disabled:false,//disabled all event
      defaultColor:'#eeff22',//the default color
      pickerAnimation:'opacity',//or 'height',`default`，the animation of open the colorPicker,the default value is `default`
      pickerAnimationTime:300,//Animation execution time，200 is default,the max time is 10000
      sure:function(color){
          console.log(color);
      },//the handler of sure
      clear:function(){
          console.log(this)
      },//the handler of clear
      togglePicker:(el,flag,context) => {
        console.log('current root element',el);
        console.log('current color picker',context);
        if(flag){
            console.log("opened");
        }else{
            console.log("closed");
        }
      },//Click the box event callback, you need to pay attention to the event trigger must be set `hasBox` to true 
      isLog:false, //Whether to turn on printing information, the default is true if the value is not specified
      changeColor:(color) => {
        console.log('the color value changed:',color);
      },
      hasBox:true //The default is true, or false, indicating whether to display the box
      isClickOutside:true, //The default is true, or false,Indicates whether it is allowed to click outside the colorPicker area to close the colorPicker
      hasClear:true,//Whether to show the clear button，the default is true
      hasSure:true, //Whether to show the sure button，the default is true,it is not recommended to set to false
      hasInput:true, //Whether to show the sure input,the default is true,it is not recommended to set to false
      boxDisabled:true,//The default is false,set it to true and set haxBox to true，then click on the box not to open the color picker
      openChangeColorMode:true,//Whether to turn on the color switching mode, note that you must set alpha and hue to true to turn on this mode
      hueDirection:"horizontal",//Or `vertical`, the default is a vertical layout display, indicating whether the hue color scale column is displayed in a horizontal or vertical layout
      alphaDirection:"horizontal",//Or vertical, the default is a vertical layout display, indicating whether the transparency column is displayed in a horizontal or vertical layout
      lang:"zh",//Or `en`, means whether to enable Chinese mode or English mode
      clearText:"clear",//The clear button text, if you want to customize the value, you need to set `userDefineText` to true
      sureText:"sure",//The sure button text, if you want to customize the value, you need to set `userDefineText` to true
      userDefineText:false,//The default is false, after setting it to true, the switch of the `lang` attribute will be invalid
  })
  //If you don’t like the way to instantiate to create a color picker, you can also use the `createColorPicker` method
  ewColorPicker.createColorPicker(config);//the param is the configuration
  //You can get the default configuration object by `getDefaultConfig` method
  ewColorPicker.getDefaultConfig();
  //For the instantiated color picker class, we also provide 3 APIs, as follows:
  color.openPicker(pickerAnimation,time);//Open the color picker manually, the parameter is the animation type, namely `height` or `opacity`
  color.closePicker(pickerAnimation,time);//Manually close the color picker, the parameters are the same as the manual open method
  color.updateColor(color);//Manually update the color value, the parameter is the color value, the unqualified color value will give an error prompt, and the color picker panel must be open
```

## import from cdn

```js
//import the css
CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.css
CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.js
```

## use in component


```js
   import ewColorPicker from 'ewColorPicker';
  //  import the style
   import "ew-color-picker/dist/ew-color-picker.min.css"
  //or  import "ew-color-picker/src/style/ew-color-picker.css"
   const colorPicker = new ewColorPicker(option);//option is the configuration object, see above for details

```
> tips: It should be noted that starting from version 1.6.4, if there are multiple dom elements passed in, only the first dom element will be rendered as a colorPicker. If multiple colorPickers need to be rendered, an array can be used for instance. E.g:
```js
   const els = document.querySelectorAll('.demo');
   els.forEach(item => {
     new ewColorPicker(item);
     //or new ewColorPicker({
    //  el:item,
    //  }) //and the configuration
   })
```

For more details, please refer to the official website of the document [ewColorPicker](https://eveningwater.github.io/ew-color-picker/);

> Domestic access is slow and accessible [ewColorPicker](https://eveningwater.gitee.io/ew-color-picker/)

# the update logs

* 1.9.9 Fixed the horizontal layout positioning problem of the alpha bar, adjusted the `$` tool method, and added the `$$` tool method.
* 1.9.8 fixes some problems,add the animation type,now contains "height","opacity","default".
* 1.9.7 fixes some problems
* 1.9.6 Fixed some problems of the color picker, and added the method `destroy` to destroy the color picker instance globally.
* 1.9.5 Fixed the problem of multiple color selector configuration objects, and added the method `destroy` to destroy the color selector instance.
* 1.9.4 Fixed the problem of responsive update.
* 1.9.0 ~ 1.9.3 fixed some problems, and modified the introduction and configuration of dependent packages.
* 1.8.9 Added the `lang` language configuration attribute, added the `clearText` and `sureText` attributes, used to customize the text of the clear button and the OK button, and added the `userDefineText` attribute, used to open the user Customize the text of the clear button and the OK button. If this attribute is not enabled, then the manual setting of the `clearText` and `sureText` attribute values ​​is invalid. If the value is enabled, the language mode is invalid.
* 1.8.8 Changed el configuration properties and isLog properties into non-responsive properties, modified the type definition, modified the minimum width and height limits of size, modified the maximum limit of animation execution time, and changed the `openAndClosePicker` configuration object property method The name is changed to `togglePicker`, and the return parameter of togglePicker is modified.
* 1.8.7 Fixed the problem of clicking on predefined color elements
* 1.8.6 The color picker configuration object has added a responsive function. Whether it is adding, deleting or changing the properties of the color picker, it will trigger the update of the color picker. At the same time, the `pickerAnimationTime` property has been added to indicate the time to execute the animation. The time is set too long and some codes are optimized.
* 1.8.5 Cancel the verification of the el attribute and not passing the dom element. If no parameters are passed, the color selector will be added to the body by default (but a container element will be generated to contain it).
* 1.8.3 ~ 1.8.4 fixed some problems and optimized some codes
* 1.8.2 Fixed the issue of transparency change in the horizontal direction, adjusted the layout and optimized some codes.
* 1.8.1 Fixed some problems and added `hueDirection` and `alphaDirection` attributes.
* 1.8.0 Fixed the problem of adding to the body, and modified the problem of setting disabled to true.
* 1.7.9 Fixed the problem of hiding color blocks.
* 1.7.8 Fixed the problem of hiding the input, optimized the code, and changed the `openPickerAni` configuration property name to `pickerAnimation`.
* 1.7.7 Fixed some problems with predefined colors and optimized some codes.
* 1.7.6 Fixed some problems, opened the internal tool methods, can access all tool methods through `ewColorPicker.util`, and modified the verification of the color value to support the input of English color words, such as setting predefined colors and The default color.
* 1.7.5 Fixed the problem of default assignment of transparency, renamed the callback of the original `openPicker` to open or close the color block by clicking on it, and renamed it to `openOrClosePicker`, and optimized the code.
* 1.7.4: Fixed the problem that the transparency of color mode switching does not change, and added the `boxBgColor` configuration property, which indicates whether the background color of the color block changes when the color panel is opened and the color value is triggered. If you do not click OK Button, the color panel will be restored to the default color after closing the color panel. The predefined color array `predefineColor` has added an array item that can be passed as an object or a string. The object is defined as `{ color:"#123",disabled:true }(color Is a qualified color value, disabled is true or false, indicating whether to disable the predefined click to change color)`.
* 1.7.3: Optimized the color value algorithm, and added the `boxDisabled` and `openChangeColorMode` configuration properties.
* 1.7.2: Added the ability to add a color selector to the `body`, but a container element will be generated to contain it, and the `disabled` configuration attribute is changed to prohibit all clicks.
* 1.3.3 ~ 1.7.1: The basic function of the color picker has been added.
