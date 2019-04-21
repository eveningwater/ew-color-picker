# ew-drag

一个基于原生js而封装的拖拽插件

## 安装与使用

### 安装
```
  npm install ew-drag --save-dev

```
### 引入

```
  <script src="./release/bundle.js"></script>
  
```

然后允许默认配置与自定义配置，代码如下:

```
  //自定义配置
  //参数为插件的配置对象
  var drag = new ewDrag({
      el: document.getElementsByClassName('demo'),//拖动元素
      designEL:'.title',//或document.getElementByClassName('title),//指定拖拽区域
      isWindow: true,//是否限制在浏览器可见窗口内,如果为false，超出后出现滚动条
      scopeEl:document.getElementsByClassName('box'),//如果和width与height同时设置了，则优先执行这个限制元素,设置了此属性，则不能将isWindow属性设置为false
      width: 400,//限制拖动元素范围宽，则不能将isWindow属性设置为false
      height: 400//限制拖动元素范围高，则不能将isWindow属性设置为false
      axis:"x" //或"y",限制在X轴或者y轴拖动
      origin:true, //或false,是否在拖动之后还原位置
      startCB:function(){},//拖动开始回调
      moveCB:function(){},//拖动时回调
      endCB:function(){},//拖动结束时回调
      dragDisabled:true,//或false，是否禁止拖拽
      disabledButton:'.btn'//或document.getElementByClassName('btn'),//点击按钮禁止或启用拖拽
      grid:[50,50] //网格规范拖动
  });
  //其中el和scopeEl的值也可以是传成字符串,如el:'.demo',scopeEl:'.box'
  //默认配置(传入拖拽元素的dom对象或者获取dom对象的字符串)
  var drag = new ewDrag('.demo');
  //或var drag = new ewDrag(document.getElementByClassName('demo'))

```

## cdn引入

CDN:https://www.unpkg.com/ew-drag@1.0.2/release/bundle.js

## 在组件中使用

```
   import ewDrag from 'ew-drag'

   var drag = new ewDrag(option);//option为配置对象，详情见前述

   如果是在`vue`中使用，最好在`mounted`周期中实例化
   
```