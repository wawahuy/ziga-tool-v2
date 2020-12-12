// ((b = 9 - b), (e = 9 - e), (a = 8 - a), (d = 8 - d))

export interface IPiece {
  colIndex: number;
  rowIndex: number;
  index: number;
  chessType: EChessType;
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

export default class InjectService {
  snapshotBaseMove = this.gameLayer.onMove;
  snapshotBaseSelectPiece = this.gameLayer.selectPiece;
  snapshotBaseTouchUpHandle = this.gameLayer.touchUpHandle;
  snapshotBaseDealCard = this.gameLayer.onDealCard;
  snapshotBaseFinishGame = this.gameLayer.onFinishGame;

  constructor() {
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

  pointToIndex(point: IPoint) {
    const row = this.gameLayer.getRowIndex(point.y);
    const col = this.gameLayer.getColIndex(point.x);
    return { col, row };
  }


  /**
   * ********************
   * *** LISTENER    ****
   * ********************
   */
  injectMoveListener(callback: (ax: number, ay: number, bx: number, by: number, time: number) => true) {
    let injectListen = (...args: any[]) => {
      const [a, b, c, d, e] = args;
      if (callback(a, b, c, d, e)) {
        this.snapshotBaseMove.call(this.gameLayer, ...args);
      }
      console.log('Inject move', ...args);
    }
    this.gameLayer.onMove = injectListen;
  }

  injectSelectListener(callback: (indexChess: number) => true) {
    const injectListen = (...args: any[]) => {
      if (callback(args[0])) {
        this.snapshotBaseSelectPiece.call(this.gameLayer, ...args);
      }
      console.log('Inject select', ...args);
    }
    this.gameLayer.selectPiece = injectListen;
  }

  injectTouchMoveListener(callback: (point: IPoint) => true) {
    const injectTouchListener = (x: number, y: number) => {
      if (callback({x, y})) {
        this.snapshotBaseTouchUpHandle.call(this.gameLayer, x, y);
      }
      console.log('Touch', x, y);
    }
    this.gameLayer.touchUpHandle = injectTouchListener;
  }

  injectStartGameListener(callback: (...args: any[]) => true) {
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
