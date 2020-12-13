import React from 'react';
import { Button, Checkbox, Input } from 'antd';
import { LockOutlined, PoweroffOutlined  } from '@ant-design/icons';
import styles from './style.scss';

export default function Login() {
  return (
    <div className={styles.containerLogin}>
      <div className={styles.containerLogo}>
      </div>
      <div className={styles.containerInput}>
        <div>
          <Input
            className={styles.keyInput}
            size="large"
            placeholder="khóa bí mật"
            prefix={<LockOutlined />} /> <br/>
          <Checkbox
            className={styles.checkbox}
            checked={true}

          >
            ghi nhớ khóa
          </Checkbox>
          <div className={styles.cntSubmit}>
            <Button type="primary" shape="round" icon={<PoweroffOutlined  />} size="large">
              Kết nối a
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
