import React, { useEffect, useRef, useState } from 'react';
import { IPiece } from '../../services/GameInjectService';
import {EMainInjectEvent, EMenu, INumKeyPair, MainInjectService} from '../../services/MainInjectService';
import { Button, Slider, Switch } from 'antd';
import { SecurityScanOutlined, CloseOutlined } from '@ant-design/icons';
import styles from './index.styles.scss';

export default function Inject() {
  const mainInjectService = useRef<MainInjectService>();
  const [menu, setMenu] = useState<INumKeyPair>({});
  const [pieceSelect, setPieceSelect] = useState<IPiece | null>();
  const [ponderPiece, setPonderPiece] = useState<boolean>();

  useEffect(() => {
    mainInjectService.current = new MainInjectService();
    mainInjectService.current.on(EMainInjectEvent.SHOW_OPTION_PIECE, (piece: IPiece) => {
      setPieceSelect(piece);
    });
    mainInjectService.current.on(EMainInjectEvent.REMOVE_ALL_DRAW, () => {
      setPieceSelect(null);
      setPonderPiece(false);
    });
    mainInjectService.current.on(EMainInjectEvent.DRAW_MENU, (menu: INumKeyPair) => {
      setMenu({...menu});
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
          unCheckedChildren="Tắt Auto"
          checkedChildren="Bật Auto"
          checked={menu[EMenu.AUTO]}
          onChange={mainInjectService.current?.hocSetMenu(EMenu.AUTO)}
          />

        <Switch
          className={styles.item}
          disabled={menu[EMenu.AUTO]}
          unCheckedChildren="Tắt tìm nước đi tốt"
          checkedChildren="Bật tìm nước đi tốt"
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
      </section>
    </div>
  )

}
