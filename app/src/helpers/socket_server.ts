import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { log } from './common';

export interface IData {
  name: string;
  data?: Object;
}

export interface IAuth {
  status?: boolean;
  message?: string;
  currentDate?: string;
  expireDate?: string;
}


export declare interface SocketClientServer {
  on(event: 'auth', listener: (status: IAuth) => void): this;
  on(event: 'open', listener: () => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'pong', listener: () => void): this;
  on(event: 'version', listener: (appVersion: string) => void): this;
}

export class SocketClientServer extends  EventEmitter {
  private ws: WebSocket | null;
  private itPing: NodeJS.Timeout;

  constructor() {
    super();
    this.ws = new WebSocket(process.env.SERVER_WS as string);
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onerror = this.onError.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onmessage = this.onData.bind(this);

    this.on('pong', this.onPong.bind(this));
    this.itPing = setInterval(() => {
      this.send({
        name: 'ping'
      })
    }, 10000);
  }

  private onPong() {
    log('ping');
  }

  private onOpen() {
    log('socket is opened');
    this.emit('open');
  }

  private onError() {
    log('socket is error');
    clearInterval(this.itPing);
    this.ws = null;
    this.emit('close');
  }

  private onClose() {
    clearInterval(this.itPing);
    this.ws = null;
    this.emit('close');
  }

  private onData(ev: WebSocket.MessageEvent) {
    try {
      const data = ev.data.toString();
      const json = JSON.parse(data) as IData;
      log(json);
      this.emit(json.name, json.data);
    } catch (e) {
      log(e);
    }
  }

  send(data: IData) {
    const dt = JSON.stringify(data);
    log(data);
    this.ws?.send(dt);
  }

  get isOpen() {
    return !!this.ws && this.ws.readyState == this.ws.OPEN;
  }

  auth(token: string) {
    this.send({
      data: token,
      name: 'auth'
    })
  }

  close() {
    this.ws?.close();
  }
}