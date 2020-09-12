import React from 'react';
import logo from './logo.svg';
import './App.css';
import ewColorPicker from 'ew-color-picker';

class ColorPicker extends React.Component {
    constructor(props){
      super(props);
      this.state = {};
    }
    componentDidMount(){
      new ewColorPicker({
        el:"#color-picker",
        sure:(color) => {
            this.props.changeBg(color);
        },
        clear:(color) => {
          this.props.clearBg(color);
        }
      })
    }
    render(){
      return (
        <div id="color-picker"></div>
      )
    }
}
class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      color:"#fff"
    }
  }
  changeBg(color){
    this.setState({ color:color });
  }
  clearBg(color){
    this.setState({ color:color });
  }
  render(){
    return (
      <div className="App" style={{ 'background':this.state.color }}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>欢迎使用ew-color-picker!</h1>
        </header>
        <main className="main">
          <ColorPicker changeBg={this.changeBg.bind(this)} clearBg={this.clearBg.bind(this)}></ColorPicker>
        </main>
      </div>
    )
  }
}


export default App;
