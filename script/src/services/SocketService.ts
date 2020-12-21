import { message } from 'antd';
import { EventEmitter } from 'events';

export interface IData {
  name: string;
  data?: Object;
}


enum EMessageType {
  SUCCESS,
  WARNING,
  ERROR
}

export interface IMoveInfo {
  depth: number, move: {ax: number, ay: number, bx: number, by: number}
}

export interface IAuth {
  auth?: boolean;
  message?: string;
  timeRemaining?: number;
}

export interface IMessage {
  type?: EMessageType;
  message?: string;
  autoHide: boolean
}

export declare interface SocketService {
  on(event: 'infomove', listener: (data: IMoveInfo) => void): this;
  on(event: 'bestmove', listener: (data: IMoveInfo) => void): this;
  on(event: 'startfindmove', listener: () => void): this;
  on(event: 'auth', listener: (data: IAuth) => void): this;
  on(event: 'message', listener: (data: IMessage) => void): this;
  once(event: 'auth', listener: (data: IAuth) => void): this;
}


export class SocketService extends EventEmitter {
  private static _instance: SocketService;

  static instance() {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService;
    }
    return SocketService._instance;
  }

  private ws: WebSocket;


  private constructor() {
    super();
    this.ws = new WebSocket(process.env.APP_SOCKETIO as string);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onData.bind(this);

    this.on('message', (data) => {
      const func = data.type == EMessageType.ERROR ? 'error' :
                   data.type == EMessageType.SUCCESS ? 'success' :
                   'warn';
      if (data.autoHide) {
        message[func](data.message);
      } else {
        message[func](data.message, 0);
      }
    });
  }

  private onOpen() {
    console.log('socket is opened');
  }

  private onError() {
    console.log('socket is error');
  }

  private onClose() {
    message.error('Bạn bị mất kết nối đến app vui lòng khởi động lại ziga', 0);
  }

  private onData(ev: MessageEvent) {
    try {
      const data = ev.data;
      const json = JSON.parse(data) as IData;
      console.log(json);
      this.emit(json.name, json.data);
    } catch (e) {
      console.log(e);
    }
  }

  send(data: IData) {
    const dt = JSON.stringify(data);
    console.log(data);
    this.ws.send(dt);
  }

  openCotuong() {
    this.send({
      name: 'opencotuong'
    })
  }

  startCotuong(isChessBlack: boolean) {
    this.send({
      name: 'startcotuong',
      data: isChessBlack
    })
  }

  closeCotuong() {
    this.send({
      name: 'closecotuong'
    })
  }

  moveCotuong(moves: any[]) {
    this.send({
      name: 'movecotuong',
      data: moves
    })
  }


  setDepth(depth: number) {
    this.send({
      name: 'setdepth',
      data: depth
    });
  }

  cancelFindMove() {
    this.send({
      name: 'cancelfindmove',
      data: {}
    });
  }

  auth(token: string) {
    this.send({
      name: 'auth',
      data: token
    })
  }
}
