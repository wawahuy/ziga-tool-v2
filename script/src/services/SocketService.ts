import { EventEmitter } from 'events';

export interface IData {
  name: string;
  data?: Object;
}

export declare interface SocketService {
  on(event: 'infomove', listener: () => void): this;
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
    this.ws.onmessage = this.onData.bind(this);
  }

  private onOpen() {
    console.log('socket is opened');
  }

  private onError() {
    console.log('socket is error');
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


}
