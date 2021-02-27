import React, { useState } from 'react';
import { Button, Checkbox, Input, List, Popover, message } from 'antd';
import { LockOutlined, SendOutlined, ShoppingCartOutlined, ShoppingOutlined  } from '@ant-design/icons';
import styles from './style.scss';
import logo from '../../assets/logo-white.png';
import { IAuth, SocketService } from '../../services/SocketService';
import { IContext } from '../../context';

const packBuy = [
  '  30d  -   100k',
];

const STORAGE_TOKEN = 'yuh_token';
const STORAGE_CHECKED = 'yuh_token_checked';

export default function Login(props: IContext) {
  const [saveToken, setSaveToken] = useState<boolean>(localStorage.getItem(STORAGE_CHECKED) === 'true');
  const [token, setToken] = useState<string>(localStorage.getItem(STORAGE_TOKEN) || "");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = () => {
    setLoading(true);
    if (token && saveToken) {
      localStorage.setItem(STORAGE_TOKEN, token);
    }
    localStorage.setItem(STORAGE_CHECKED, saveToken ? 'true' : 'false');

    const socket = SocketService.instance();
    socket.once('auth', (data: IAuth) => {
      if (data.auth) {
        message.success("Xác thực thành công!");
      } else {
        message.error(data.message);
      }
      setLoading(false);
      props?.setTimeRemaining?.(data.timeRemaining || null);
      props?.setAuth?.(data.auth || false);
    });
    socket.auth(token);
  }

  return (
    <div className={styles.containerLogin}>
      <div className={styles.containerLogo}>
        <a href="https://giayuh.com">
          <img src={logo} />
        </a>
      </div>
      <div className={styles.containerInput}>
        <div>
          <Input
            allowClear
            disabled={true}
            value="VERSION_FREE"
            className={styles.keyInput}
            defaultValue={token}
            onChange={(e) => setToken(e.target.value)}
            size="large"
            placeholder="nhập token tại đây"
            prefix={<LockOutlined />} /> <br/>
          <Checkbox
            disabled={true}
            className={styles.checkbox}
            checked={saveToken}
            onChange={(e) => setSaveToken(e.target.checked)}
          >
            ghi nhớ token
          </Checkbox>
          <div className={styles.cntSubmit}>
            <Button
              className={styles.btnConnect}
              loading={loading}
              onClick={handleSubmit}
              type="primary"
              shape="round"
              icon={<SendOutlined />}
              size="large">
              Kết nối
            </Button>

            <Popover
              overlayClassName={styles.popupBuy}
              content={
                <>
                  <div className="sp">Vui lòng liên hệ qua zalo <b>(+84) 942 100 614</b> để được hổ trợ.</div>
                </>
                }
              title="Mua token"
              trigger="click"
            >
              <Button className={styles.btnBuy} type="primary" shape="round" icon={<ShoppingCartOutlined  />} size="large">
                Mua token
              </Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
