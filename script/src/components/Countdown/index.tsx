import React from 'react';
import CountdownV from "react-countdown";
import styles from "./index.scss";

export default function Countdown(props: { date?: Date | string | number}) {
  return (
    <div className={"ant-message " + styles.styleCoutdown}>
      <div className="ant-message-notice-content">
        <div className="ant-message-custom-content ant-message-error">
          <span>
            <CountdownV date={props.date} />
          </span>
        </div>
      </div>
    </div>
  )
}
