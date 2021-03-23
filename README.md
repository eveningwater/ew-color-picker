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
      openPickerAni:'opacity',//或者'height'，开启颜色选择器面板的动画
      sure:function(color){
          console.log(color);
      },//点击确定按钮的回调
      clear:function(){
          console.log(this)
      },//点击清空按钮的回调
      openPicker:function(el,scope){
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
  })
  //如果不喜欢实例化的方式来创建一个颜色选择器，也可以使用createColorPicker方法
  ewColorPicker.createColorPicker(config);//config为属性配置对象
  //当然还提供了一个api，可以获取默认的配置对象
  ewColorPicker.getDefaultConfig();
  //实例化的颜色选择器类，我们还提供了三个api，如下:
  color.openPicker(openPickerAni);//手动打开颜色选择器，参数为动画类型，即height或opacity
  color.closePicker(openPickerAni);//手动关闭颜色选择器，参数同手动打开方法一样
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

* 1.7.3:优化了颜色值算法，新增了`boxDisabled`和`openChangeColorMode`配置属性。
* 1.7.2:新增了允许将颜色选择器添加到`body`中，但会生成一个容器元素来包含，将`disabled`配置属性更改成了全部禁止点击。
* 1.3.0 ~ 1.7.1:添加了颜色选择器的基本功能。
