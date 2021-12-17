import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { EUCCIOption, UCCI } from './ucci';
import System from './system';
import * as _ from 'lodash';
import { getPath, isProduction, log } from './common';
import fs from 'fs';

class Player extends EventEmitter {
  engine!: UCCI;
  moves: string[];
  isBlackChess: boolean = false;
  socket!: WebSocket;
  prevMove!: Object | null;
  depth = 15;
  
  constructor() {
    super();
    this.moves = [];
    this.engine = new UCCI;
    this.engine.on('infomove', this._onEngineInfoMove.bind(this));
    this.engine.on('bestmove', this._onEngineBestMove.bind(this));
    this.on('opencotuong', this._onOpenCotuong.bind(this));
    this.on('startcotuong', this._onStartCotuong.bind(this));
    this.on('closecotuong', this._onCloseCotuong.bind(this));
    this.on('movecotuong', this._onMoveCotuong.bind(this));
    this.on('setdepth', this._onSetDepth.bind(this));
    this.on('cancelfindmove', this._onCancelFindMove.bind(this));
  }

  static async get(socket: WebSocket) {
    const player = new Player;
    player.socket = socket;
    await player.init();
    return player;
  }

  async init() {
    const info = await System.get();
    const isProd = isProduction();
    // const isProd = true;
    // const threads = Math.min(info.cpu.cores, isProd ? 512 : 4);
    // const memory = Math.min(Math.round(info.memory.free/1024/1024*0.5), isProd ? 1024 : 16);
    const threads = 1;
    const memory = 128;
    this.engine.load();
    this.engine.ucci();
    this.engine.on('ucciok', () => {
      log('start engine');
      this.engine.setOption(EUCCIOption.Threads, threads);
      this.engine.setOption(EUCCIOption.Hash, memory);
      this.engine.setOption(EUCCIOption.EvalFile, getPath('/file1.nnue'));
      this.engine.ready();
    });
  }

  close() {
    log('quit engine');
    this.engine.quit();
  }

  send(name: string, data: Object) {
    this.socket.send(JSON.stringify({ name, data }));
  }

  private _onOpenCotuong() {
    log('open cotuong');
  }

  private _onStartCotuong(isBlack: boolean) {
    log('start cotuong, black=', isBlack);
    this.isBlackChess = isBlack;
    this.prevMove = null;
    this.moves = [];
    if (!isBlack) {
      this.go();
    }
  }

  _onSetDepth(depth: number) {
    this.depth = depth;
  }

  private _onCloseCotuong() {
    log('close co tuong');
  }

  private _onMoveCotuong(args: number[]) {
    if (this.prevMove && _.isEqual(this.prevMove, args)) {
      return;
    }
    this.prevMove = args;
    const [ ax, ay, bx, by ] = args;
    const move = this._convertToMoveStr(ax, ay, bx, by);
    this.moves.push(move);

    log('move cotuong', args, move);
    const size = this.moves.length;
    if (
      (this.isBlackChess && size % 2 !== 0) ||
      (!this.isBlackChess && size % 2 === 0)
    ) {
      this.go();
    }
  }

  _onCancelFindMove() {
    this.engine.command('stop');
  }

  private _convertToMoveStr(ax: number, ay: number, bx: number, by: number) {
    const a = String.fromCharCode(97 + ax);
    const b = Number(ay);
    const c = String.fromCharCode(97 + bx);
    const d = Number(by);
    const move = a + b + c + d;
    return move;
  }

  private _convertToMoveObject(moveStr: string) {
    const sp = moveStr.split('');
    const move = {
      ax: -1,
      ay: -1,
      bx: -1,
      by: -1
    };
    move.ax = sp[0].charCodeAt(0) - 97;
    move.ay = Number(sp[1]);
    move.bx = sp[2].charCodeAt(0) - 97;
    move.by = Number(sp[3]);
    return move;
  }

  private go() {
    let postion = 'position startpos';
    if (this.moves.length) {
      postion += ' moves ' + this.moves.join(' ');
    }
    if (this.isBlackChess) {
      postion += ' w';
    }
    log(postion);
    this.engine.command(postion);
    this.engine.command('go depth ' + this.depth);
    // this.engine.command('go movetime 25000');
    this.send('startfindmove', {});
  }

  private _onEngineInfoMove(depth: number, moves: string) {
    if (!moves.length) {
      return;
    }

    const move = this._string2move(moves[0]);

    this.send('infomove', {
      depth: Number(depth),
      move
    })
  }

  private _onEngineBestMove(moveStr: string, ponder: string) {
    const move = this._string2move(moveStr);

    this.send('bestmove', {
      depth: -1,
      move
    })
  }

  private _string2move(moveStr: string) {
    const move = this._convertToMoveObject(moveStr);

    if (this.isBlackChess) {
      let { ax, ay, bx, by } = move;
      move.ay = 9 - Number(ay);
      move.by = 9 - Number(by);
      move.ax = 8 - Number(ax);
      move.bx = 8 - Number(bx);
    }

    return move;
  }
}

export default Player;