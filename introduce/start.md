# ewColorPicker

一个基于原生js而封装的颜色选择器插件。

## 安装与使用

### 安装
```js
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
  //  颜色值改变时触发
   color.config.changeColor = function(color){
     console.log(color)
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
      disabled:false,//从1.7.2版本开始禁止颜色选择器的所有点击
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
      changeBoxByChangeColor:false,//如果设置为true，则在色块显示的时候，打开颜色面板，色块会根据颜色的改变而变色
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

## cdn引入

CDN:
```js
  //样式引入
  CDN:https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.css
  //完整版,这样始终引入的是最新版本的颜色选择器插件
  https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.js
  //压缩版
  https://www.unpkg.com/ew-color-picker/dist/ew-color-picker.min.js
  //或者引入指定版本（完整版）
  https://www.unpkg.com/ew-color-picker@1.5.5/dist/ew-color-picker.js
  //压缩版
  https://www.unpkg.com/ew-color-picker@1.5.5/dist/ew-color-picker.min.js
```

## 在组件中使用


```js
   import ewColorPicker from 'ew-color-picker';
   import "ew-color-picker/dist/ew-color-picker.min.css";
   import "ew-color-picker/src/ew-color-picker.css";
   var pluginName = new ewColorPicker(option);//option为配置对象，详情见前述
```
> 在线示例

[在线示例1](https://eveningwater.github.io/ew-color-picker/example/color.html)
[在线示例2](https://eveningwater.github.io/ew-color-picker/example/color-body.html)
[在线示例3](https://eveningwater.github.io/ew-color-picker/example/color-predefine.html)
[在线示例4](https://eveningwater.github.io/ew-color-picker/example/color-show.html)
[在线示例5](https://eveningwater.github.io/ew-color-picker/example/color-size.html)
[在线示例6](https://eveningwater.github.io/ew-color-picker/example/color-box-disabled.html)
[在线示例7](https://eveningwater.github.io/ew-color-picker/example/color-mode.html)

> 在vue中可以写如下代码:

```html
  <!--页面通常有一个根元素-->
  <div id="app">
        <div class="container" :style="{ background:backgroundColor }">
          <div id="color-picker"></div>
        </div>
    </div>
```
```js
  new Vue({
      data() {
          return {
              colorPicker: null,
              backgroundColor: ""
          }
      },
      mounted() {
          const that = this;
          this.colorPicker = new ewColorPicker({
              el: "#color-picker",
              size: "mini",
              isLog: false,
              alpha: true,
              predefineColor: ["#fff", "#2396ef"],
              sure: that.handler,
              clear: that.handler
          })
      },
      methods: {
          handler(color) {
              this.backgroundColor = color;
          }
      }
  }).$mount("#app");
```
> vue3.0 composition api写法
```html
    <div id="app">
        <!-- 数据的绑定稍微变动一下即可 -->
        <div class="container" :style="{ background:state.backgroundColor }">
            <div id="color-picker"></div>
        </div>
    </div>
```
```js
    Vue.createApp({
        setup() {
            const state = Vue.reactive({
                colorPicker: null,
                backgroundColor: ""
            });
            const handler = (color) => {
                state.backgroundColor = color;
            }
            Vue.onMounted(() => {
                state.colorPicker = new ewColorPicker({
                    el: "#color-picker",
                    size: "mini",
                    isLog: false,
                    alpha: true,
                    predefineColor: ["#fff", "#2396ef"],
                    sure: handler,
                    clear: handler
                })
            })
            return {
                state
            }
        }
    }).mount("#app")
```

[在vue2.0中使用的在线示例](https://eveningwater.github.io/ew-color-picker/example/vue-color-demo.html)
[在vue3.0中使用的在线示例](https://eveningwater.github.io/ew-color-picker/example/vue-next-color-demo.html)

> 在react中可以写如下代码:

```html
  <!--页面通常有一个根元素-->
  <div id="app"></div>
```

```css
  * {
      margin: 0;
      padding: 0;
  }
  .container {
    padding: 20px;
    background-color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
```
> class写法

```js
  class ColorPicker extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        color:""
      }
    }
    handler = (color) => {
        this.setState({
          color:color
        })
    };
    componentDidMount(){
      let that = this;
      new ewColorPicker({
        el:"#color-picker",
        size:"mini",
        isLog:false,
        alpha:true,
        predefineColor:["#fff","#2396ef"],
        sure:that.handler,
        clear:that.handler
      });
    }
    render(){
      return (
        <div className="container" style={ {'background-color':this.state.color} }>
            <div id="color-picker"></div>
         </div>
      )
    }
  }
```
> hook写法

```js
  const ColorPicker = (props) => {
      const [color,setColor] = React.useState("");
      let handler = (color) => {
          setColor(color);
      };
      React.useEffect(() => {
          new ewColorPicker({
            el:"#color-picker",
            size:"mini",
            isLog:false,
            alpha:true,
            predefineColor:["#fff","#2396ef"],
            sure:handler,
            clear:handler
          });
          return null;
      },[])
      return (
        <div className="container" style={ {'background-color':color} }>
           <div id="color-picker"></div>
        </div>
      )
  }
```
然后，绑定到根元素上，代码如下:

```js
  ReactDOM.render(<ColorPicker />, document.getElementById('#app'));
```
[在react中使用的在线示例](https://eveningwater.github.io/ew-color-picker/example/react-color-demo.html)

> 说明:在react的工程化如create-react-app以及vue的工程化如vue-cli使用方式同引入式开发差不多的。

还可以封装成一个颜色组件，如在`vue3.0`脚手架的示例[demo](https://github.com/eveningwater/website/blob/master/src/components/ColorPicker.vue)。


