## Installation

### Installation by use npm
```js
  npm install ew-color-picker --save-dev
  //npm install ew-color-picker -D
```

### Installation by use yarn

```js
  yarn add ew-color-picker --D
```

## import

```js
  <script src="./dist/ew-color-picker.min.js"></script>
```

## use

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

## Special Note

> tips: It should be noted that starting from version 1.6.4, if there are multiple dom elements passed in, only the first dom element will be rendered as a colorPicker. If multiple colorPickers need to be rendered, an array can be used for instance. E.g:

```js
   let els = document.querySelectorAll('.demo');
   els.forEach(item => {
     new ewColorPicker(item);
     //or new ewColorPicker({
    //  el:item,
    //  }) //and the configuration
   })
```

## use cdn

CDN:
```js
  //import css
  CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.css
  //full version,This always imports the latest version of the colorPicker
  https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.js
  //mini version
  https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.js
  //or import the detail version (full version)
  https://www.unpkg.com/ew-color-picker@1.9.8/dist/ew-color-picker.js
  //mini version
  https://www.unpkg.com/ew-color-picker@1.9.8/dist/ew-color-picker.min.js
```

## used in framework


```js
   import ewColorPicker from 'ew-color-picker';
  //  import the style
   import "ew-color-picker/dist/ew-color-picker.min.css";
  //or  import "ew-color-picker/src/style/ew-color-picker.css";
   const colorPicker = new ewColorPicker(option);//option is the configuration object, see above for details
```