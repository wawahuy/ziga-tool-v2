import React from "react"
import ReactDOM from "react-dom"
import style from "./index.scss"
import Inject from "./containers/Inject";

function App() {
  return (
    <>
    {
      false &&
      <section className={style.inject}>
      </section>
    }
    {
      true &&
      <Inject />
    }
    </>
  )
}

const injectContainer = document.createElement('div');
const canvas = document.getElementById('Cocos2dGameContainer');
canvas?.appendChild(injectContainer);
ReactDOM.render(<App />, injectContainer);
