# ew-drag
一个基于原生js而封装的拖拽插件
## 安装与使用

```
  //自定义配置
  var drag = new ewDrag({
      el: document.getElementsByClassName('demo'),//拖动元素
      isWindow: true,//是否限制在浏览器可见窗口内,如果为false，超出后出现滚动条
      scopeEl:document.getElementsByClassName('box'),//如果和width与height同时设置了，则优先执行这个限制元素,设置了此属性，则不能将isWindow属性设置为false
      width: 400,//限制拖动元素范围宽，则不能将isWindow属性设置为false
      height: 400//限制拖动元素范围高，则不能将isWindow属性设置为false
  });
  //其中el和scopeEl的值也可以是传成字符串,如el:'.demo',scopeEl:'.box'
  //默认配置(传入拖拽元素的dom对象或者获取dom对象的字符串)
  var drag = new ewDrag('.demo');
  //或var drag = new ewDrag(document.getElementByClassName('demo'))

```

## cdn引入

CDN:https://www.unpkg.com/ew-drag@0.0.3/release/bundle.js