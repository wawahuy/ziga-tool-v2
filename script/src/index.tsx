import React, { useState } from "react"
import ReactDOM from "react-dom"
import style from "./index.scss"
import Inject from "./containers/Inject";
import Login from "./containers/Login";
import Countdown from "./components/Countdown";
import Context, { withContext } from "./context";
const CmpLogin = withContext(Login);

function App() {
  const [auth, setAuth] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>();


  return (
    <Context.Provider value={{
      setAuth,
      setTimeRemaining
    }}>
    {
      !auth &&
      <section className={style.inject}>
        <CmpLogin />
      </section>
    }
    {
      auth && (
        <>
          <Inject />
          <Countdown date={Date.now() + (timeRemaining || 0)}></Countdown>
        </>
      )
    }
    </Context.Provider>
  )
}

const injectContainer = document.createElement('div');
const canvas = document.getElementById('Cocos2dGameContainer');
canvas?.setAttribute('id', 'Cocos2dGameContainerC');
canvas?.appendChild(injectContainer);
ReactDOM.render(<App />, injectContainer);
