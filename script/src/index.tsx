import React from "react"
import ReactDOM from "react-dom"
import style from "./index.scss"
import Login from "./containers/Login"

function App() {
  return (
    <section className={style.inject}>
      <Login />
    </section>
  )
}

const injectContainer = document.createElement('div');
const canvas = document.getElementById('Cocos2dGameContainer');
canvas?.appendChild(injectContainer);
ReactDOM.render(<App />, injectContainer);
