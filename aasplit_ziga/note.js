// size
cc.director._winSizeInPoints

// stask scene
cc.director._scenesStack

//
cc.director._scenesStack[0].getGameLayer().onMove

/// log move
const moveFunc = cc.director._scenesStack[0].getGameLayer().onMove;
const gameLayer = cc.director._scenesStack[0].getGameLayer();
const logic = gameLayer.getLogic();
cc.director._scenesStack[0].getGameLayer().onMove = (...args) => {
  console.log(...args);
  moveFunc.call(gameLayer, ...args);
};

const selectFunc = gameLayer.selectPiece;
gameLayer.selectPiece = (...args) => {
  console.log(...args);
  selectFunc.call(gameLayer, ...args);
};

gameLayer.chessPieces.map((chess) => ({
  isDead: chess.isDead,
  chessType: chess.chessType,
  rowIndex: chess.rowIndex,
  colIndex: chess.colIndex
}))


/// logic
/// getMyPos()
/// processMovePiece(a1, b1, a2, b2)


/// setOpacity 0->1000
/// gameLayer.selectPiece func
///          .pieceSelected

/// chess
// this.lmColStart = a;
// this.lmRowStart = b;
// this.lmColFinish = d;
// this.lmRowFinish = e;


/// chess type
BkChessType = { VUA: 0, SI: 1, TUONG: 2, XE: 3, PHAO: 4, MA: 5, TOT: 6 };


/// get XY by location
gameLayer._getLocationPos(index)


/// draw
/// cc.color
var drawNode = new cc.DrawNode();
drawNode.drawSegment(cc.p(0,0), cc.p(200,300),2,cc.Color(250,0,0,255));
