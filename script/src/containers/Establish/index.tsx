import React from 'react';
import styles from './style.scss';
import { LoadingOutlined } from '@ant-design/icons';


export default function Establish() {
  let version = (process.env.VERSION_APP?.split('').join('.') + '.' + process.env.VERSION_UI);

  return (
    <div className={styles.containerEstablish}>
      <div className={styles.containerLoading}>
        <LoadingOutlined></LoadingOutlined>
        <span>Đang mở tools hack</span>
      </div>
      <div className={styles.containerVersion}>
        (build: {version})
      </div>
    </div>
  )
}
