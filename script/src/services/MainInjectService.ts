import { EventEmitter } from 'events';
import GameInjectService, { IPiece, IPoint } from './GameInjectService';
import { IMoveInfo, SocketService } from './SocketService';
import { EGameType, SocketInjectService } from './SocketInjectService';
import * as _ from 'lodash';
import { IDraw } from '../helpers/IDraw';
import CCDirectorPiece from '../helpers/CCDirectorPiece';
import CCNode from '../helpers/CCNode';
import { CCColorHex } from '../helpers/CCColor';

SocketService.instance()

export enum EMenu {
  FIND_BEST_MOVE,
  AUTO,
  DEPTH
}

export enum EMainInjectEvent {
  SHOW_MENU = 'showmenu',
  HIDE_MENU = 'hidemenu',
  SHOW_OPTION_PIECE = 'showOptionPiece',
  HIDE_OPTION_PIECE = 'hideOptionPiece',
  REMOVE_ALL_DRAW   = 'removeAllDraw',
  DRAW_MENU         = 'drawMenu',
  FIND_MOVE_START   = 'findMoveStart',
  FIND_MOVE_END     = 'findMoveEnd',
  MESS_NO_SELECT    = 'messNoSelect'
}

export declare interface MainInjectService {
  on(event: EMainInjectEvent.SHOW_OPTION_PIECE, listener: (piece: IPiece) => void): this;
  on(event: EMainInjectEvent.HIDE_OPTION_PIECE, listener: () => void): this;
  on(event: EMainInjectEvent.SHOW_MENU, listener: () => void): this;
  on(event: EMainInjectEvent.HIDE_MENU, listener: () => void): this;
  on(event: EMainInjectEvent.REMOVE_ALL_DRAW, listener: () => void): this;
  on(event: EMainInjectEvent.DRAW_MENU, listener: (menu: INumKeyPair) => void): this;
  on(event: EMainInjectEvent.FIND_MOVE_START, listener: () => void): this;
  on(event: EMainInjectEvent.FIND_MOVE_END, listener: () => void): this;
  on(event: EMainInjectEvent.MESS_NO_SELECT, listener: () => void): this;
}

export interface MainInjectAction {
  enablePonder(): boolean;
  disablePonder(): boolean;
  hocSetMenu(type: EMenu): (e: any) => any;
}

export interface INumKeyPair {
  [key: number]: any
}

export class MainInjectService extends EventEmitter implements MainInjectAction {
  menu: INumKeyPair = {};
  gameInject!: GameInjectService;
  socketInject!: SocketInjectService;
  socketMain!: SocketService;
  elementCanvas: HTMLCanvasElement | undefined;

  pieceSelected!: IPiece;
  ponder: boolean = false;
  ponderTarget!: IPoint;
  cancelSelect: boolean = false;

  nodeDraw: IDraw[] = [];

  constructor() {
    super();
    this.elementCanvas = document.getElementById('Cocos2dGameContainer')?.getElementsByTagName('canvas')[0];
    this.socketMain = SocketService.instance();
    this.socketInject = new SocketInjectService;
    this.socketInject.on('join', this.joinListener.bind(this));
    this.socketInject.on('leave', this.outListener.bind(this));
    this.socketMain.on('infomove', this.onEngineInfoMove.bind(this));
    this.socketMain.on('bestmove', this.onEngineBestMove.bind(this));
    this.socketMain.on('startfindmove', this.onEngineStartFindMove.bind(this));
  }

  private initMenu() {
    this.menu[EMenu.AUTO] = localStorage.getItem('yuh_' + EMenu.AUTO) == "1";
    this.menu[EMenu.FIND_BEST_MOVE] = localStorage.getItem('yuh_' + EMenu.FIND_BEST_MOVE) == "1";
    this.menu[EMenu.DEPTH] = localStorage.getItem('yuh_' + EMenu.DEPTH) || 15;
    this.emit(EMainInjectEvent.DRAW_MENU, this.menu);
    this.setDepth(this.menu[EMenu.DEPTH]);
  }

  private joinListener(typeGame: EGameType) {
    if (typeGame == EGameType.CO_TUONG) {
      console.log('open cot uong');
      setTimeout(() => {
        this.ponder = false;
        this.gameInject = new GameInjectService;
        this.gameInject.injectSelectListener(this.selectListener.bind(this));
        this.gameInject.injectTouchUpListener(this.touchUpListener.bind(this));
        this.gameInject.injectPieceMoveListener(this.pieceMoveListener.bind(this));
        this.gameInject.injectStartGameListener(this.startListener.bind(this));
        this.initMenu();
        this.emit(EMainInjectEvent.SHOW_MENU);
        this.socketMain.openCotuong();
      }, 1000);
    }
  }

  private outListener() {
    console.log('out cot uong');
    this.socketMain.closeCotuong();
    this.emit(EMainInjectEvent.HIDE_MENU);
  }

  private startListener() {
    setTimeout(() => {
      this.socketMain.startCotuong(this.gameInject.isChessBlack);
    }, 1000);
    return true;
  }

  private selectListener(indexChess: number) {
    if (this.cancelSelect) {
      this.emit(EMainInjectEvent.MESS_NO_SELECT);
      return false;
    }

    const listPieces = this.gameInject?.listPieces;
    if (listPieces) {
      const pieces = listPieces[indexChess];
      this.pieceSelected = pieces;
      this.emit(EMainInjectEvent.SHOW_OPTION_PIECE, pieces);
    }
    return true;
  }

  private touchUpListener(point: IPoint): boolean {
    if (this.ponder && this.gameInject) {
      this.ponderTarget = this.gameInject.pointToIndex(point);
      return false;
    }
    return true;
  }


  private pieceMoveListener(ax: number, ay: number, bx: number, by: number) {
    this.emit(EMainInjectEvent.REMOVE_ALL_DRAW);
    console.log('test move', ax, ay, bx, by);
    this.nodeDraw.map(node => node.remove(this.gameInject));
    this.nodeDraw = [];
    setTimeout(() => {
      this.socketMain.moveCotuong([ax, ay, bx, by]);
    });
    return true;
  }

  private onEngineInfoMove(data: IMoveInfo) {
    if (!this.menu[EMenu.FIND_BEST_MOVE]) {
      return;
    }

    const start = this.gameInject.indexToPoint({ col: data.move.ax, row: data.move.ay });
    const end = this.gameInject.indexToPoint({ col: data.move.bx, row: data.move.by });

    const moveCurrent = this.nodeDraw.find(node => {
      if (node instanceof CCDirectorPiece) {
        return node.isEquals(data.move.ax, data.move.ay, data.move.bx, data.move.by);
      }
      return false;
    });

    if (moveCurrent) {
      (moveCurrent as CCDirectorPiece).setDepth(data.depth);
      console.log('re set depth', data.depth, moveCurrent);
    } else {
      const dir = new CCDirectorPiece(start.x, start.y, end.x, end.y, data.depth);
      dir.setUserData(data.move.ax, data.move.ay, data.move.bx, data.move.by);
      dir.add(this.gameInject);
      this.nodeDraw.push(dir);
      console.log('set new nodedraw', data);
    }
  }

  private onEngineBestMove(data: IMoveInfo) {
    this.cancelSelect = false;
    const moveBest = this.nodeDraw.find(node => {
      if (node instanceof CCDirectorPiece) {
        return node.isEquals(data.move.ax, data.move.ay, data.move.bx, data.move.by);
      }
      return false;
    });

    if (moveBest) {
      (moveBest as CCDirectorPiece).remove(this.gameInject);
    }

    const start = this.gameInject.indexToPoint({ col: data.move.ax, row: data.move.ay });
    const end = this.gameInject.indexToPoint({ col: data.move.bx, row: data.move.by });
    const dir = new CCDirectorPiece(start.x, start.y, end.x, end.y, data.depth, 9);
    dir.setUserData(data.move.ax, data.move.ay, data.move.bx, data.move.by);
    dir.add(this.gameInject);
    this.nodeDraw.push(dir);
    this.emit(EMainInjectEvent.FIND_MOVE_END);

    setTimeout(() => {
      if (this.menu[EMenu.AUTO]) {
        this.gameInject.move(data.move.ax, data.move.ay, data.move.bx, data.move.by);
      }
    }, 200);
  }

  private onEngineStartFindMove() {
    this.cancelSelect = true;
    this.emit(EMainInjectEvent.FIND_MOVE_START);
  }

  computeRealY(y: number) {
    return (this.gameInject?.size.height || 0) - y;
  }

  enablePonder(): boolean {
    if (this.pieceSelected) {
      this.ponder = true;
      return true;
    }
    return false;
  }

  disablePonder(): boolean {
    if (!this.pieceSelected) {
      this.ponder = false;
      return true;
    }
    return false;
  }

  hocSetMenu(type: EMenu): (e: any) => any {
    return (value: any) => {
      this.menu[type] = value;
      switch (type) {
        case EMenu.AUTO:
        case EMenu.FIND_BEST_MOVE:
          localStorage.setItem('yuh_' + type, value ? "1" : "0")
          break;

        case EMenu.DEPTH:
          this.menu[type] = value as number;
          this.setDepth(value as number)
          localStorage.setItem('yuh_' + type, value as string)
          break;
      }
      this.emit(EMainInjectEvent.DRAW_MENU, this.menu);
    }
  }

  setDepth = (depth: number) => {
    this.socketMain.setDepth(depth);
  }

  cacelFindMove() {
    this.socketMain.cancelFindMove();
  }
}
