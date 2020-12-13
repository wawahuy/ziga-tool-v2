import {EventEmitter} from 'events';
import GameInjectService, { IPiece, IPoint } from './GameInjectService';
import { EGameType, SocketInjectService } from './SocketInjectService';

export declare interface MainInjectService {
  on(event: 'select', listener: (piece: IPiece) => void): this;
  on(event: 'move', listener: () => void): this;
}

export class MainInjectService extends EventEmitter {
  gameInject: GameInjectService | undefined;
  socketInject: SocketInjectService;
  ponder: boolean = false;

  constructor() {
    super();
    this.socketInject = new SocketInjectService;
    this.socketInject.on('join', this.joinListener.bind(this));
  }

  private joinListener(typeGame: EGameType) {
    if (typeGame == EGameType.CO_TUONG) {
      setTimeout(() => {
        this.ponder = false;
        this.gameInject = new GameInjectService;
        this.gameInject.injectSelectListener(this.selectListener.bind(this));
        this.gameInject.injectTouchMoveListener(this.touchListener.bind(this));
        this.gameInject.injectMoveListener(this.moveListener.bind(this));
      }, 1000);
    }
  }

  private selectListener(indexChess: number) {
    const listPieces = this.gameInject?.listPieces;
    if (listPieces) {
      const pieces = listPieces[indexChess];
      this.emit('select', pieces);
    }
    return true;
  }

  private touchListener(point: IPoint): boolean {
    if (this.ponder) {
      return false;
    }
    return true;
  }

  private moveListener(ax: number, ay: number, bx: number, by: number, time: number) {
    this.emit('move');
    this.setStatusPonder(false);
    return true;
  }

  computeRealY(y: number) {
    return (this.gameInject?.size.height || 0) - y;
  }

  setStatusPonder(status: boolean) {
    this.ponder = status;
  }
}
