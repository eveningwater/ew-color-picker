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
      hue:true,//是否开启色调
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
      clear:function(defaultColor){
          console.log(defaultColor)
      },//点击清空按钮的回调
      openPicker:function(el,scope){
         if(scope.config.pickerFlag){
             console.log('打开颜色选择器')
         }else{
             console.log('关闭颜色选择器')
         }
      },//点击色块事件回调
      isLog:false, //是否开启打印信息,默认是true如果不指定该值的话
      changeColor:(color) => {
        // 返回改变后的颜色值
      }
  })

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
