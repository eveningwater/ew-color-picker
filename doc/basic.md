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