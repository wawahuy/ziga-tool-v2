import React, { useEffect, useRef, useState } from 'react';
import { IPiece } from '../../services/GameInjectService';
import {MainInjectService} from '../../services/MainInjectService';
import { Button } from 'antd';
import { SecurityScanOutlined, CloseOutlined } from '@ant-design/icons';

export default function Inject() {
  const mainInjectService = useRef<MainInjectService>();
  const [pieceSelect, setPieceSelect] = useState<IPiece | null>();
  const [ponderPiece, setPonderPiece] = useState<boolean>();

  useEffect(() => {
    mainInjectService.current = new MainInjectService();
    mainInjectService.current.on('select', (piece: IPiece) => {
      setPieceSelect(piece);
    });
    mainInjectService.current.on('move', () => {
      setPieceSelect(null);
      setPonderPiece(false);
    });
  }, [])

  const handlePonder = (status: boolean) => {
    setPonderPiece(status);
    mainInjectService.current?.setStatusPonder(status);
  }

  return (
    <>
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
              type="dashed"
              icon={<SecurityScanOutlined />}
              onClick={() => handlePonder(true)}
            />
            :
            <Button
              size="small"
              shape="circle"
              type="dashed"
              icon={<CloseOutlined />}
              onClick={() => handlePonder(false)}
            />
          }
      </div>
    }
    </>
  )
}
