import React from "react"
import ReactDOM from "react-dom"
import style from "./index.scss"

function App() {
  return (
    <>
      <section className={style.inject}>
      </section>
    </>
  )
}

const injectContainer = document.createElement('div');
const canvas = document.getElementById('Cocos2dGameContainer');
canvas?.appendChild(injectContainer);
ReactDOM.render(<App />, injectContainer);
