import GameInjectService from 'services/GameInjectService';
import * as _ from 'lodash';
import { CCColorHex } from './CCColor';
import CCNode from './CCNode';
import { IDraw } from './IDraw';
import CCText from './CCText';

const colors = [
  '#E52B50',
  '#FFBF00',
  '#9966CC',
  '#FBCEB1',
  '#7FFFD4',
  '#007FFF',
  '#89CFF0',
  '#CB4154',
  '#8A2BE2',
  '#DE5D83',
  '#964B00',
  '#6F4E37',
]

class CCDirectorPiece implements IDraw {
  node: any;
  nodeDepth: CCText;
  _node: IDraw[] = [];
  static globalPosColor = 0;

  _depth: number = 0;
  _move: {
    ax?: number;
    ay?: number;
    bx?: number;
    by?: number;
  } = {};

  constructor(ax: number, ay: number, bx: number, by: number, depth: number) {
    const color = this.getColor();
    const line = new CCNode;
    line.drawLine(ax, ay, bx, by, 3, color),
    this._node.push(line);

    const circle = new CCNode;
    circle.drawSolidCircle(bx, by, 30, color);
    this._node.push(circle);

    this.nodeDepth = new CCText;
    this.nodeDepth.setText(depth.toString());
    this.nodeDepth.setPosition(bx - 10, by + 10);
    this.nodeDepth.setColor(color);
    this.nodeDepth.setZOrder(1000000);
    this._node.push(this.nodeDepth);

    this._move = {ax, ay, bx, by};
    this._depth = depth;
  }

  add(gameInject: GameInjectService): void {
    this._node.map(node => node.add(gameInject));
  }
  remove(gameInject: GameInjectService): void {
    this._node.map(node => node.remove(gameInject));
  }

  getColor() {
    const color =  CCColorHex(colors[CCDirectorPiece.globalPosColor]);
    if (++CCDirectorPiece.globalPosColor >= colors.length) {
      CCDirectorPiece.globalPosColor = 0;
    }
    return color;
  }

  isEquals(ax: number, ay: number, bx: number, by: number) {
    return _.isEqual({ax, ay, bx, by}, this._move);
  }

  setDepth(depth: number) {
    this._depth = depth;
    this.nodeDepth.setText(depth.toString());
  }
}

export default CCDirectorPiece;
