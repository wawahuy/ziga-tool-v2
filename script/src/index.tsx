import React from "react"
import ReactDOM from "react-dom"
import { Button } from "antd"
import style from "./index.scss"

function App() {
  return (
    <div className={style.inject}>
       <Button type="primary">Primary Button</Button>
    </div>
  )
}

const injectContainer = document.createElement('div');
const canvas = document.getElementById('Cocos2dGameContainer');
canvas?.appendChild(injectContainer);
ReactDOM.render(<App />, injectContainer);
