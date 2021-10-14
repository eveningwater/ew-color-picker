import { useState } from "react";
import "./App.css";
import ColorPicker from "./components/colorPicker";
const App = () => {
    const [config] = useState({
        alpha:true,
        changeColor(color){
            console.log(color);
        }
    });
    return (
        <div className="app">
            <ColorPicker colorConfig={config}></ColorPicker>
        </div>
    )
}
export default App;