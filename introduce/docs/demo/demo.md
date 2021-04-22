## 无框架示例

> 在线示例

* [在线示例](https://eveningwater.github.io/ew-color-picker/example/color.html)

## 响应式示例

> 响应式示例

* [在线示例](https://eveningwater.github.io/ew-color-picker/example/color-9.html)

## vue2.x示例

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

[在vue2.0中使用的在线示例](https://eveningwater.github.io/ew-color-picker/example/vue-color-demo.html)

## vue3.x示例

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

[在vue3.0中使用的在线示例](https://eveningwater.github.io/ew-color-picker/example/vue-next-color-demo.html)

## react示例

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

## 特别说明

> 说明:在react的工程化如create-react-app以及vue的工程化如vue-cli使用方式同引入式开发差不多的。

还可以封装成一个颜色组件，如在`vue3.0`脚手架的示例[demo](https://github.com/eveningwater/website/blob/master/src/components/ColorPicker.vue)。

## 更多示例

详见[更多示例](https://github.com/eveningwater/ew-color-picker/tree/master/example)。

## 一个完整的示例

这里有一个完整的示例。[完整示例](http://js.jirengu.com/fusicemita/3/)。


