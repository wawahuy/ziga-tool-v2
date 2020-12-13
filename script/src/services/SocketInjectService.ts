// BkLogicManager.initGameLogic()
// BkGlobal.currentGameID
//     CO_TUONG: 19,
//     CO_UP: 20,
import { EventEmitter } from 'events';

export enum EInjectNetworkType {
  NETWORK_TABLE_JOIN_SUCCESS = 9,
  NETWORK_GAME_JOIN_SUCCESS = 70,
  NETWORK_GAME_LEAVE_SUCCESS = 72,
}

export enum EGameType {
  CO_TUONG = 19,
  CO_UP = 20,
}


export declare interface SocketInjectService {
  on(event: 'message', listener: (type: EInjectNetworkType, header: any, buffer: any) => void): this;
  on(event: 'join', listener: (typeGame: EGameType) => void): this;
  on(event: 'leave', listener: () => void): this;
}

export class SocketInjectService extends EventEmitter {
  snapshootBaseOpen = BkConnectionManager.onOpen;
  spapshootBaseMessage = BkConnectionManager.connection.connectionWS.onmessage;

  constructor() {
    super();
    this.injectMessageListener();
  }

  private injectMessageListener() {
    const listener = (r: any) => {
      const packet = new BkPacket;
      packet.parsePacketWithBuffer(new Int8Array(r.data))
      const type = packet.Type;
      const header = packet.Header;
      const buffer = packet.Buffer;
      this.emit('message', type, header, buffer);

      switch (type) {
        case EInjectNetworkType.NETWORK_TABLE_JOIN_SUCCESS:
          this.emit('join', buffer?.Buf[0]);
          break;

        case EInjectNetworkType.NETWORK_GAME_LEAVE_SUCCESS:
          this.emit('leave');
          break;
      }

      this.spapshootBaseMessage(r);
    }

    BkConnectionManager.connection.connectionWS.onmessage = listener;
  }
}
