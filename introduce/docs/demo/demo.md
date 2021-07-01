## no framework demo

> online demo

* [online demo](https://eveningwater.github.io/ew-color-picker/example/color.html)

## reactivity demo

> reactivity demo

* [online demo](https://eveningwater.github.io/ew-color-picker/example/color-9.html)

## vue2.x demo

> in vue2.x we can write code as follow:

```html
  <!--the page often has a root element-->
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

[online demo used in vue2.x](https://eveningwater.github.io/ew-color-picker/example/vue-color-demo.html)

## vue3.x demo

> vue3.0 composition api

```html
    <div id="app">
        <!-- change the data binding -->
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

[online demo used in vue3.0](https://eveningwater.github.io/ew-color-picker/example/vue-next-color-demo.html)

## react demo

> in react we can write code as follow:

```html
  <!--the page often has a root element-->
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
> class

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
> hook

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
then，bound it to the root element，the code as follow:

```js
  ReactDOM.render(<ColorPicker />, document.getElementById('#app'));
```
[online demo used in react](https://eveningwater.github.io/ew-color-picker/example/react-color-demo.html)

## Special Note

> note:The use of react such as `create-react-app` and vue such as `vue-cli` is similar to introductory development。

We can also be packaged into a color component，such as `vue-cli` in `vue3.0`[demo](https://github.com/eveningwater/website/blob/master/src/components/ColorPicker.vue)。

## more demo

see [more demo](https://github.com/eveningwater/ew-color-picker/tree/master/example)。

## A complete example

Here is a complete example。as follow:

[complete demo](https://eveningwater.github.io/ew-color-picker/example/all-color.html)。


