import React, { useCallback, useEffect, useRef, useState } from 'react';
import GameInjectService, { IPiece } from '../../services/GameInjectService';
import {EMainInjectEvent, EMenu, INumKeyPair, MainInjectService} from '../../services/MainInjectService';
import { Button, Slider, Switch, message } from 'antd';
import { SecurityScanOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.styles.scss';
import { MessageType } from 'antd/lib/message';

export default function Inject() {
  const mainInjectService = useRef<MainInjectService>();
  const messageRef = useRef<MessageType>();
  const [menu, setMenu] = useState<INumKeyPair>({});
  const [pieceSelect, setPieceSelect] = useState<IPiece | null>();
  const [ponderPiece, setPonderPiece] = useState<boolean>();
  const [visible, setVisible] = useState(false);
  const [visibleBtnC, setVisibleBtnC] = useState(false);


  useEffect(() => {
    mainInjectService.current = new MainInjectService();
    mainInjectService.current.on(EMainInjectEvent.SHOW_MENU, () => {
      setVisible(true);
    });
    mainInjectService.current.on(EMainInjectEvent.HIDE_MENU, () => {
      setVisible(false);
    });
    mainInjectService.current.on(EMainInjectEvent.SHOW_OPTION_PIECE, (piece: IPiece) => {
      // setPieceSelect(piece);
    });
    mainInjectService.current.on(EMainInjectEvent.REMOVE_ALL_DRAW, () => {
      setPieceSelect(null);
      setPonderPiece(false);
    });
    mainInjectService.current.on(EMainInjectEvent.DRAW_MENU, (menu: INumKeyPair) => {
      setMenu({...menu});
    });
    mainInjectService.current.on(EMainInjectEvent.FIND_MOVE_START, () => {
      if (messageRef.current) {
        messageRef.current?.();
      }
      messageRef.current = message.loading('Tìm nước đi...', 0);
      setVisibleBtnC(true);
    });
    mainInjectService.current.on(EMainInjectEvent.FIND_MOVE_END, () => {
      messageRef.current?.();
      setVisibleBtnC(false);
    });
    mainInjectService.current.on(EMainInjectEvent.MESS_NO_SELECT, () => {
      message.error('Đang tìm nước đi!');
    });
  }, [])

  const handlePonder = (status: boolean) => {
    setPonderPiece(status);
    if (status) {
      mainInjectService.current?.enablePonder();
    } else {
      mainInjectService.current?.disablePonder();
    }
  }

  return (
    visible &&
    <div className={styles.injectCnt}>
    {
      pieceSelect &&
      <div
        style={{
          position: 'absolute',
          top: (
                  mainInjectService.current?.computeRealY(pieceSelect.y) || 0 +
                  pieceSelect.height / 2
                ) + 'px',
          left: (
                  pieceSelect.x +
                  pieceSelect.width / 4
                ) + 'px',
        }}
        >
          {
            !ponderPiece ?
            <Button
              size="small"
              shape="circle"
              icon={<SecurityScanOutlined />}
              onClick={() => handlePonder(true)}
            />
            :
            <Button
              size="small"
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => handlePonder(false)}
            />
          }
      </div>
    }
      <section className={styles.injectMenu}>
        <Switch
          className={styles.item}
          unCheckedChildren="Đã tắt Auto"
          checkedChildren="Đã bật Auto"
          checked={menu[EMenu.AUTO]}
          onChange={mainInjectService.current?.hocSetMenu(EMenu.AUTO)}
          />

        <Switch
          className={styles.item}
          unCheckedChildren="Đã hiện all move"
          checkedChildren="Đã ẩn all move"
          checked={menu[EMenu.FIND_BEST_MOVE]}
          onChange={mainInjectService.current?.hocSetMenu(EMenu.FIND_BEST_MOVE)}
          />

        <Slider
          className={styles.item}
          value={menu[EMenu.DEPTH]}
          min={1}
          max={25}
          tipFormatter={(v) => "Depth: " + v}
          onChange={mainInjectService.current?.hocSetMenu(EMenu.DEPTH)} />



        {
          visibleBtnC &&
          <Button
            onClick={() => mainInjectService.current?.cacelFindMove()}
            className={styles.cntCancel}>
              Hủy tìm moves
          </Button>
        }
      </section>
    </div>
    ||
    <></>
  )

}
