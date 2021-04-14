# ew-color-picker

一个基于原生js而封装的颜色选择器插件。

## 安装与使用

### 安装
```
  npm install ew-color-picker --save-dev

```
### 引入

```js
  <script src="./dist/ew-color-picker.min.js"></script>
  
```

颜色选择器插件如下:

```js
   //默认配置
   var color = new ewColorPicker('.demo');
   或 var color = new ewColorPicker(document.getElementByClassName('demo'));
   //点击确定
   color.config.sure = function(color){
       //返回颜色值
   }
   //点击取消
   color.config.clear = function(defaultColor){
     //返回默认颜色值
   }
  //  当颜色值改变时触发
  color.config.changeColor = function(color){
     //返回改变后的颜色值，即color
  }
     //自定义配置
   var color = new ewColorPicker({
      el:'.demo2',//绑定选择器的dom元素
      alpha:true,//是否开启透明度
      hue:false,//是否开启色调
      size:{
          width:100,
          height:50
      },//颜色选择器类型，有四个字符串值normal,medium,small,mini或者一个对象自定义宽高
      predefineColor:['#223456','rgba(122,35,77,.5)'],//预定义颜色是一个数组
      disabled:false,//是否禁止开启选择器面板
      defaultColor:'#eeff22',//默认颜色
      pickerAnimation:'opacity',//或者'height'，开启颜色选择器面板的动画
      sure:function(color){
          console.log(color);
      },//点击确定按钮的回调
      clear:function(){
          console.log(this)
      },//点击清空按钮的回调
      openOrClosePicker:function(el,scope){
         if(scope.config.pickerFlag){
             console.log('打开颜色选择器')
         }else{
             console.log('关闭颜色选择器')
         }
      },//点击色块事件回调,需要注意该事件触发必须要将hasBox设置为true
      isLog:false, //是否开启打印信息,默认是true如果不指定该值的话
      changeColor:(color) => {
        console.log('颜色值改变时触发:',color);
      },
      hasBox:true //默认为true,或者为false，表示是否显示颜色选择器
      isClickOutside:true, //默认为true，或者设置为false,表示是否允许点击颜色选择器区域之外关闭颜色选择器
      hasClear:true,//是否显示清空按钮，默认为true
      hasSure:true, //是否显示确定按钮，默认为true,不建议设置为false
      hasColorInput:true, //是否显示输入框,默认为true,不建议设置为false
      boxDisabled:true,//默认是false,设置为true并且hasBox为true，禁止点击色块打开颜色选择器
      openChangeColorMode:true,//是否打开颜色切换模式，注意打开这个模式必须要将alpha和hue设置为true
      hueDirection:"horizontal",//或者vertical,默认是垂直布局显示,表示hue色阶柱是水平还是垂直布局显示
      alphaDirection:"horizontal",//或者vertical,默认是垂直布局显示,表示透明度柱是水平还是垂直布局显示
  })
  //如果不喜欢实例化的方式来创建一个颜色选择器，也可以使用createColorPicker方法
  ewColorPicker.createColorPicker(config);//config为属性配置对象
  //当然还提供了一个api，可以获取默认的配置对象
  ewColorPicker.getDefaultConfig();
  //实例化的颜色选择器类，我们还提供了三个api，如下:
  color.openPicker(pickerAnimation);//手动打开颜色选择器，参数为动画类型，即height或opacity
  color.closePicker(pickerAnimation);//手动关闭颜色选择器，参数同手动打开方法一样
  color.updateColor(color);//手动更新颜色值，参数为颜色值，不合格的颜色值会给出错误提示,并且颜色选择器面板要处于开启状态
```

## cdn引入
//样式引入
CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.css
CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.js

## 在组件中使用


```js
   import ewColorPicker from 'ewColorPicker';
   import "ew-color-picker/dist/ew-color-picker.min.css"
   import "ew-color-picker/src/ew-color-picker.css"
   var pluginName = new ewColorPicker(option);//option为配置对象，详情见前述

```
> tips: 需要注意的是，从1.6.4版本开始，如果传入的dom元素是多个，则只有第一个dom元素渲染成颜色选择器，如果需要渲染多个颜色选择器，可使用一个数组来实例化。例如:
```js
   let els = document.querySelectorAll('.demo');
   els.forEach(item => {
     new ewColorPicker(item);
     //或new ewColorPicker({
    //  el:item,
    //  }) //以及一些相关配置属性
   })
```

更多详情参阅文档官网介绍[ewColorPicker](https://eveningwater.github.io/ew-color-picker/);

> 国内访问速度慢可访问[ewColorPicker](https://eveningwater.gitee.io/ew-color-picker/)

# 更新日志

* 1.8.5 取消el属性和不传dom元素的验证，如果不传任何参数，则默认将颜色选择器添加到body中(但会生成一个容器元素来包含)。
* 1.8.3 ~ 1.8.4 修复了一些问题，优化了一些代码
* 1.8.2 修复了水平方向透明度改变问题,并调整了一下布局和优化了一些代码。
* 1.8.1 修复了一些问题，并添加了`hueDirection`和`alphaDirection`属性。
* 1.8.0 修复了添加到body中的问题，以及修改了将disabled设置为true的问题。
* 1.7.9 修复了隐藏色块的问题。
* 1.7.8 修复了将input隐藏的问题，优化了代码，将`openPickerAni`配置属性名更改为`pickerAnimation`。
* 1.7.7 修复了预定义颜色的一些问题，优化了一些代码。
* 1.7.6 修复了一些问题，开放了内部工具方法，可通过`ewColorPicker.util`访问到所有工具方法，并修改了颜色值的验证，支持英文颜色单词的传入，例如设置预定义颜色以及默认颜色。
* 1.7.5 修复了透明度默认赋值问题，将原`openPicker`点击色块打开或关闭的回调更名为`openOrClosePicker`，优化了代码。
* 1.7.4:修复了颜色模式切换透明度不改变问题，新增了`changeBoxByChangeColor`配置属性,该属性表示是否在打开颜色面板，颜色值触发的时候，色块的背景色更改，如果不点击确定按钮，关闭颜色面板后会恢复到默认颜色,预定义颜色数组`predefineColor`新增了可以传数组项为对象或字符串，对象定义为`{ color:"#123",disabled:true }(color为合格的颜色值,disabled为true或者false，表示是否禁用该预定义点击更换颜色)`。
* 1.7.3:优化了颜色值算法，新增了`boxDisabled`和`openChangeColorMode`配置属性。
* 1.7.2:新增了允许将颜色选择器添加到`body`中，但会生成一个容器元素来包含，将`disabled`配置属性更改成了全部禁止点击。
* 1.3.3 ~ 1.7.1:添加了颜色选择器的基本功能。
