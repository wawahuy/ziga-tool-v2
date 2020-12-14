import {io, Socket} from 'socket.io-client';

export default class SocketService {
  private static _instance: SocketService;

  static instance() {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService;
    }
    return SocketService._instance;
  }

  private socketIO: Socket;

  get io() {
    return this.socketIO;
  }

  private constructor() {
    this.socketIO = io(process.env.APP_SOCKETIO as string);
    this.socketIO.on('connect', this.onOpen.bind(this));
    this.socketIO.on('error', this.onError.bind(this));
    this.socketIO.connect();
  }

  private onOpen() {
    console.log('socket is opened');
  }

  private onError() {
    console.log('socket is error');
  }
}
