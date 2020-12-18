import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { EUCCIOption, UCCI } from './ucci';
import System from './system';

class Player extends EventEmitter {
  engine!: UCCI;
  moves: string[];
  isBlackChess: boolean = false;
  socket!: WebSocket;

  
  constructor() {
    super();
    this.moves = [];
    this.engine = new UCCI;
    this.engine.on('infomove', this._onEngineInfoMove.bind(this));
    this.on('opencotuong', this._onOpenCotuong.bind(this));
    this.on('startcotuong', this._onStartCotuong.bind(this));
    this.on('closecotuong', this._onCloseCotuong.bind(this));
    this.on('movecotuong', this._onMoveCotuong.bind(this));
  }

  static async get(socket: WebSocket) {
    const player = new Player;
    player.socket = socket;
    await player.init();
    return player;
  }

  async init() {
    const info = await System.get();
    const threads = info.cpu.cores;
    const memory = Math.round(info.memory.free/1024/1024*0.1);
    this.engine.load();
    this.engine.ucci();
    this.engine.on('ucciok', () => {
      console.log('start engine');
      this.engine.setOption(EUCCIOption.Threads, 1 || threads);
      this.engine.setOption(EUCCIOption.Hash, 16 || memory);
      this.engine.ready();
    });
  }

  close() {
    console.log('quit engine');
    this.engine.quit();
  }

  send(name: string, data: Object) {
    this.socket.send(JSON.stringify({ name, data }));
  }

  private _onOpenCotuong() {
    console.log('open cotuong');
  }

  private _onStartCotuong(isBlack: boolean) {
    console.log('start cotuong, black=', isBlack);
    this.isBlackChess = isBlack;
    if (!isBlack) {
      this.go();
    }
  }

  private _onCloseCotuong() {
    console.log('close co tuong');
  }

  private _onMoveCotuong(args: number[]) {
    const [ ax, ay, bx, by ] = args;
    const move = this._converToMoveStr(ax, ay, bx, by);
    this.moves.push(move);

    console.log('move cotuong', args, move);
    const size = this.moves.length + 1;
    if (
      this.isBlackChess && size % 2 === 0 ||
      !this.isBlackChess && size % 2 !== 0 
    ) {
      this.go();
    }
  }

  private _converToMoveStr(ax: number, ay: number, bx: number, by: number) {
    const a = String.fromCharCode(97 + ax);
    const b = Number(ay);
    const c = String.fromCharCode(97 + bx);
    const d = Number(by);
    const move = a + b + c + d;
    return move;
  }

  private go() {
    let postion = 'position startpos';
    if (this.moves.length) {
      postion += ' moves ' + this.moves.join(' ');
    }
    console.log(postion);
    this.engine.command(postion);
    this.engine.command('go depth 10');
  }

  private _onEngineInfoMove(depth: number, move: string) {
    this.send('infomove', {
      depth,
      move
    })
  }
}

export default Player;