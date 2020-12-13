import React from 'react';
import styles from './style.scss';
import { LoadingOutlined } from '@ant-design/icons';


export default function Establish() {
  return (
    <div className={styles.containerEstablish}>
      <LoadingOutlined></LoadingOutlined>
      <span>Đang mở tools hack</span>
    </div>
  )
}
