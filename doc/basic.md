### 安装

```
  npm install ewplugins --save-dev

```

安装的时候确保已经安装了`node.js`。然后安装完成之后，在`release`目录下找到`ewPlugins.min.js`,然后在页面中通过`script`标签引入。

```
  <script src="/release/ewPlugins.min.js"></script>

```

之后在页面中就可以创建一个构造函数使用呢，如下:

```
  var ewdrag = new ewPlugins(type,option);

```

其中`type`,为指定的插件类型，目前仅有`[drag,textarea]`两个值，后期会加入更多的插件,`option`为一个自定义的配置对象，后续会解释有哪些配置，我们也可以直接传一个`DOM元素`的`id`或`class`字符串，又或者直接传入一个`DOM`元素也行。一个简单的示例代码如下:

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>demo</title>
    <style>
        .drag{
            width:100px;
            height:100px;
            border:1px solid;
        }
    </style>
</head>

<body>
    <div class="drag"></div>
    <script src="/ewPlugins.min.js"></script>
    <script>
        var drag = new ewPlugins('drag','.drag');
        <!-- 创建一个自适应textarea元素 -->
        var textarea = new ewPlugins('textarea','auto');
    </script>
</body>

</html>

```

关于配置对象的详情描述，见下文。

### 配置对象

#### 拖拽插件

1.`el`:该选项传入一个字符串或者一个`dom`元素，字符串是`id`或者`class`的字符串标识。例如`<div class='drag'></div>`则传入`.drag`或者`document.getElementByClassName('drag')或者document.querySelector('.drag')`。该值表示拖动的元素。

2.`designEl`:传入值等同`el`选项。该值表示指定拖拽元素。

3.`isWindow`:布尔值`true`或者`false`。该值表示是否限制再浏览器可见窗口内拖动。这个属性优先值高于`scopeEl`和`width`与`height`选项。

4.`scopeEl`:传入值等同`el`选项。该值表示将拖动元素限制在某个元素内拖动，如果和`width`与`height`同时设置了，则优先执行这个属性，并且不可将`isWindow`值设置为`false`。

5.`axis`:传入值仅有两个`x`或`y`(不区分大小写),如果传入其它值，则会提示报错信息`a Invalid value of axis!`,也就是不可用的值的意思。

6.`origin`:值等同`isWindow`,表示是否在拖动之后还原位置。

7.`originSpeed`:还原速度设置，值为正整数(不超过拖拽的偏移量)，否则会无效，从而使用默认值，即`50`。

8.`startCB`:值为函数。表示拖动开始时，可自定义的设置事件的回调。

9.`moveCB`:值为函数。表示拖动时，可自定义的设置事件的回调。

10.`endCB`:值为函数。表示拖动结束时，可自定义的设置事件的回调。

11.`dragDisabled`:值等同`isWindow`选项，即为布尔值。表示是否禁止拖拽。

12.`disabledButton`:值等同`el`选项。表示点击启用或者禁止拖拽的按钮。

13.`ani_transition`:值为动画过渡效果，应是一个有效的过渡动画效果设置,可以是字符串形式或者对象形式，例如:`transition:all .1s linear`或`{'transition':'all .1s linear'}`,就是设置动画的过渡效果。

14.`grid`:值为一个数组，数组仅有两个数组项，且值为正整数。表示拖动元素按照网格规范来拖动。有效值如:`[100,50]`、`[45,44]`等。

一个比较完整的配置选项如下:

```
      el: document.getElementsByClassName('demo'),//拖动元素
      designEL:'.title',//或document.getElementByClassName('title),//指定拖拽区域
      isWindow: true,//是否限制在浏览器可见窗口内,如果为false，超出后出现滚动条
      scopeEl:document.getElementsByClassName('box'),//如果和width与height同时设置了，则优先执行这个限制元素,设置了此属性，则不能将isWindow属性设置为false
      width: 400,//限制拖动元素范围宽，则不能将isWindow属性设置为false
      height: 400//限制拖动元素范围高，则不能将isWindow属性设置为false
      axis:"x" //或"y",限制在X轴或者y轴拖动
      origin:true, //或false,是否在拖动之后还原位置
      originSpeed:100,//还原速度,不超过拖拽的偏移量
      startCB:function(){},//拖动开始回调
      moveCB:function(){},//拖动时回调
      endCB:function(){},//拖动结束时回调
      dragDisabled:true,//或false，是否禁止拖拽
      disabledButton:'.btn',//或document.getElementByClassName('btn'),//点击按钮禁止或启用拖拽
      ani_transition:'transition:all .1s linear',//动画过渡效果或者以对象形式{'transition':'all .1s linear'}
      grid:[50,50] //网格规范拖动

```

#### 自适应文本框插件

1.`el`:该选项传入一个字符串或者一个`dom`元素，字符串是`id`或者`class`的字符串标识。例如`<div class='demo'></div>`则传入`.demo`或者`document.getElementByClassName('demo')或者document.querySelector('.demo')`。如果指定了此项，则后面两项无效，指定此项就表示要将某个元素转换成自适应文本元素。

2.`mode`:值为`auto`或者`notAuto`。该值表示创建的是textarea元素还是普通元素,auto即textarea元素,否则就是div元素。

3.`container`:值等同`el`选项，表示在哪个元素中添加自适应文本元素。

一个比较完整的配置选项如下:

```
  var text = new ewPlugins('textarea',{
      el:'.demo',//如果指定了此项，则后面两项无效，指定此项就表示要将某个元素转换成自适应文本元素，也可以传document.getElementByClassName('demo')
      mode:"auto",//创建的是textarea元素还是普通元素,auto或notAuto,auto即textarea元素，否则就是div元素
      container:".box" //或document.getElementByClassName(box)需要添加自适应文本元素的元素
  })
```

#### 颜色选择器插件

1.`el`:该选项传入一个字符串或者一个`dom`元素，字符串是`id`或者`class`的字符串标识。例如`<div class='demo'></div>`则传入`.demo`或者`document.getElementByClassName('demo')或者document.querySelector('.demo')`。该值表示绑定颜色选择器的元素。

2.`alpha`:为布尔值`true`或者`false`。该值表示是否开启透明度设置，如果开启则颜色模式为`rgba`,不开启则为`hex`模式。

3.`size`:值可以是四个字符串值`normal`,`medium`,`small`,`mini`中的一个,或者一个对象，包含`width`和`height`设置，`width`和`height`值必须是正整数值。该值表示色块的大小。

4.`predefineColor`:值是一个包含颜色值的数组，颜色模式(hsv,rgba,hsb,hex等均可)只要浏览器能支持即可。该值表示预定义颜色。

5.`disabled`:值等同`alpha`选项。表示是否允许点击色块开启颜色选择器面板。

6.`defaultColor`:值为颜色值。表示色块的默认颜色。

7.`openPickerAni`:值为`opacity`或`height`,该值表示开启颜色选择器面板的动画。

8.`sure`:值为一个函数。该值表示点击确定按钮触发的事件回调。

9.`clear`:值为一个函数。该值表示点击清空按钮触发的事件回调。

一个比较完整的配置选项如下:

```
  var color = new ewPlugins('colorpicker',{
      el:'.demo2',//绑定选择器的dom元素
      alpha:true,//是否开启透明度
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
      }//点击清空按钮的回调
  })
  
```