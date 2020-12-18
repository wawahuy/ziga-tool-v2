import { EventEmitter } from 'events';
import GameInjectService, { IPiece, IPoint } from './GameInjectService';
import { IMoveInfo, SocketService } from './SocketService';
import { EGameType, SocketInjectService } from './SocketInjectService';
import * as _ from 'lodash';
import { CCColor } from '../helpers/CCColor';
import CCLine from '../helpers/CCLine';

SocketService.instance()

export enum EMenu {
  FIND_BEST_MOVE,
  AUTO,
  DEPTH
}

export enum EMainInjectEvent {
  SHOW_OPTION_PIECE = 'showOptionPiece',
  HIDE_OPTION_PIECE = 'hideOptionPiece',
  REMOVE_ALL_DRAW   = 'removeAllDraw',
  DRAW_MENU         = 'drawMenu',
}

export declare interface MainInjectService {
  on(event: EMainInjectEvent.SHOW_OPTION_PIECE, listener: (piece: IPiece) => void): this;
  on(event: EMainInjectEvent.HIDE_OPTION_PIECE, listener: () => void): this;
  on(event: EMainInjectEvent.REMOVE_ALL_DRAW, listener: () => void): this;
  on(event: EMainInjectEvent.DRAW_MENU, listener: (menu: INumKeyPair) => void): this;
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

  nodeDraw: any[] = [];

  constructor() {
    super();
    this.elementCanvas = document.getElementById('Cocos2dGameContainer')?.getElementsByTagName('canvas')[0];
    this.socketMain = SocketService.instance();
    this.socketInject = new SocketInjectService;
    this.socketInject.on('join', this.joinListener.bind(this));
    this.socketInject.on('leave', this.outListener.bind(this));
    this.socketMain.on('infomove', this.onEngineInfoMove.bind(this));
  }

  private initMenu() {
    this.menu[EMenu.AUTO] = localStorage.getItem('yuh_' + EMenu.AUTO) == "1";
    this.menu[EMenu.FIND_BEST_MOVE] = localStorage.getItem('yuh_' + EMenu.FIND_BEST_MOVE) == "1";
    this.menu[EMenu.DEPTH] = localStorage.getItem('yuh_' + EMenu.DEPTH) || 15;
    this.emit(EMainInjectEvent.DRAW_MENU, this.menu);
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
        this.socketMain.openCotuong();
      }, 1000);
    }
  }

  private outListener() {
    console.log('out cot uong');
    this.socketMain.closeCotuong();
  }

  private startListener() {
    setTimeout(() => {
      console.log('start cot uong');
      this.socketMain.startCotuong(this.gameInject.isChessBlack);
    }, 1000);
    return true;
  }

  private selectListener(indexChess: number) {
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
    // this.gameInject.gameLayer.isReverse && ((ay = 9 - ay), (by = 9 - by), (ax = 8 - ax), (bx = 8 - bx));
    console.log('test move', ax, ay, bx, by);
    this.socketMain.moveCotuong([ax, ay, bx, by]);
    this.nodeDraw.map(node => this.gameInject.removeChild(node));
    return true;
  }

  private onEngineInfoMove(data: IMoveInfo) {
    const start = this.gameInject.indexToPoint({ col: data.move.ax, row: data.move.ay });
    const end = this.gameInject.indexToPoint({ col: data.move.bx, row: data.move.by });
    const line = new CCLine();
    const color = CCColor(255, 255, 255, 255);
    line.set(start.x, start.y, end.x, end.y, 2, color);
    this.gameInject.addChild(line.node);
    this.nodeDraw.push(line.node);
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
          localStorage.setItem('yuh_' + type, value as string)
          break;
      }
      this.emit(EMainInjectEvent.DRAW_MENU, this.menu);
    }
  }

}
