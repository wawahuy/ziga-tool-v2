  let script = {
    init: () => {
      script.scene =   cc.director._scenesStack[0];
      script.gameLayer = script.scene.getGameLayer();
      script.chessType = { VUA: 0, SI: 1, TUONG: 2, XE: 3, PHAO: 4, MA: 5, TOT: 6 };
      script.initMoveListener();
      script.initSelectListener();
      script.initTouchMoveListener();
    },

    initMoveListener: () => {
      let baseMove = script.gameLayer.onMove;
      let injectListen = (...args) => {
        console.log(...args);
        let [ax, ay, bx, by, time] = args;
        baseMove.call(script.gameLayer, ...args);
      }
      script.gameLayer.onMove = injectListen;
    },

    initSelectListener: () => {
      let baseSelect = script.gameLayer.selectPiece;
      let injectListen = (...args) => {
        console.log(...args);
        baseSelect.call(script.gameLayer, ...args);
      }
      script.gameLayer.selectPiece = injectListen;
    },

    initTouchMoveListener: () => {
      const baseTouch = script.gameLayer.touchUpHandle;
      const injectTouchListener = (x, y) => {
        console.log('touch', x, y, script.getIndexByXY(x, y));
        baseTouch.call(script.gameLayer, x, y);
      }
      script.gameLayer.touchUpHandle = injectTouchListener;
    },

    getLocationPieceXY(index) {
      /// x, y
      return script.gameLayer._getLocationPos(index);
    },

    getListPieces() {
      return script.gameLayer.chessPieces;
    },

    getPieceSelected() {
      const index = script.gameLayer.pieceSelected;
      if (index == -1) {
        return null;
      }
      return script.getListPieces()[index];
    },

    getIndexByXY(x, y) {
      const row = script.gameLayer.getRowIndex(y);
      const col = script.gameLayer.getColIndex(x);
      return { col, row };
    }


  }

  script.init();