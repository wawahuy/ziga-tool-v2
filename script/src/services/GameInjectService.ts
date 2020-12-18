// ((b = 9 - b), (e = 9 - e), (a = 8 - a), (d = 8 - d))

export interface IPiece {
  colIndex: number;
  rowIndex: number;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  chessType: EChessType;
}

export interface ISize {
  width: number;
  height: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IClientState  {
  isPlaying: boolean
}

export enum EChessType {
  VUA = 0,
  SI = 1,
  TUONG = 2,
  XE = 3,
  PHAO = 4,
  MA = 5,
  TOT = 6
}

export default class GameInjectService {
  snapshotBasePieceMove = this.gameLayer.onMove;
  snapshotBaseSelectPiece = this.gameLayer.selectPiece;
  snapshotBaseTouchUpHandle = this.gameLayer.touchUpHandle;
  snapshotBaseDealCard = this.gameLayer.onDealCard;
  snapshotBaseFinishGame = this.gameLayer.onFinishGame;

  constructor() {
  }

  get size(): ISize {
    return cc.director._winSizeInPoints;
  }

  get scene() {
    return cc.director._scenesStack[0];
  }

  get gameLayer() {
    return this.scene.getGameLayer();
  }

  get logic() {
    return this.scene.getLogic();
  }

  get listPieces(): IPiece[] {
    return this.gameLayer.chessPieces;
  }

  get pieceSelected() {
    const index = this.gameLayer.pieceSelected;
    if (index == -1) {
      return null;
    }
    return this.listPieces[index];
  }

  get myClientState(): IClientState {
    return this.logic.getMyClientState();
  }

  get isChessBlack(): boolean {
    return this.gameLayer.isReverse;
  }

  /**
   * Chess Index to Point
   * @param index
   * @returns {x, y}
   */
  getLocationPiece(index: number): IPoint {
    return this.gameLayer._getLocationPos(index);
  }

  pointToIndex(point: IPoint): IPoint {
    const y = this.gameLayer.getRowIndex(point.y);
    const x = this.gameLayer.getColIndex(point.x);
    return { x, y };
  }

  indexToPoint(index: {col: number; row: number}): IPoint {
    const x = this.gameLayer.getPosX(index.col);
    const y = this.gameLayer.getPosX(index.row);
    return { x, y };
  }


  /**
   * ********************
   * *** LISTENER    ****
   * ********************
   */
  injectPieceMoveListener(callback: (ax: number, ay: number, bx: number, by: number, time: number) => boolean) {
    let injectListen = (...args: any[]) => {
      const [a, b, c, d, e] = args;
      if (callback(a, b, c, d, e)) {
        this.snapshotBasePieceMove.call(this.gameLayer, ...args);
      }
      console.log('Inject move', ...args);
    }
    this.gameLayer.onMove = injectListen;
  }

  injectSelectListener(callback: (indexChess: number) => boolean) {
    const injectListen = (...args: any[]) => {
      if (callback(args[0])) {
        this.snapshotBaseSelectPiece.call(this.gameLayer, ...args);
      }
      console.log('Inject select', ...args);
    }
    this.gameLayer.selectPiece = injectListen;
  }

  injectTouchUpListener(callback: (point: IPoint) => boolean) {
    const injectTouchListener = (x: number, y: number) => {
      if (callback({x, y})) {
        this.snapshotBaseTouchUpHandle.call(this.gameLayer, x, y);
      }
      console.log('Touch', x, y);
    }
    this.gameLayer.touchUpHandle = injectTouchListener;
  }

  injectStartGameListener(callback: (...args: any[]) => boolean) {
    const injectListener = (...args: any[]) => {
      if (callback(...args)) {
        this.snapshotBaseDealCard.call(this.gameLayer, ...args);
      }
      console.log('Start game');
    }
    this.gameLayer.onDealCard = injectListener;
  }

  injectFinishGameListener(callback: (...args: any[]) => true) {
    const injectListener = (...args: any[]) => {
      if (callback(...args)) {
        this.snapshotBaseFinishGame.call(this.gameLayer, ...args);
      }
      console.log('Finish game');
    }
    this.gameLayer.onFinishGame = injectListener;
  }
}
