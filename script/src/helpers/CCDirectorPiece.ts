import GameInjectService from 'services/GameInjectService';
import * as _ from 'lodash';
import { CCColorHex } from './CCColor';
import CCNode from './CCNode';
import { IDraw } from './IDraw';
import CCText from './CCText';

const colors = [
  '#E52B50',
  '#000000',
  '#003153',
  '#4B0082',
  '#FF6600',
  '#808000',
  '#800000'
]

class CCDirectorPiece implements IDraw {
  node: any;
  nodeDepth: CCText;
  nodeLine: CCNode;
  _node: IDraw[] = [];
  static globalPosColor = 0;

  _depth: number = 0;
  _move: {
    ax?: number;
    ay?: number;
    bx?: number;
    by?: number;
  } = {};

  constructor(ax: number, ay: number, bx: number, by: number, depth: number, lw = 4) {
    const color = this.getColor();

    const circle = new CCNode;
    circle.drawCircle(bx, by, 30, lw, color);
    this._node.push(circle);

    bx += bx > ax ? -30 : bx < ax ? 30 : 0;
    by += by > ay ? -30 : by < ay ? 30 : 0;
    const line = new CCNode;
    let xc1 = 0, yc1 = 0, xc2 = 0, yc2 = 0;
    let dirLine = _.random(0, 1) ? -1 : 1;
    if (ax - bx === 0) {
      xc1 = ax + dirLine*_.random(10, 100);
      yc1 = ay;
      xc2 = bx + dirLine*_.random(10, 100);
      yc2 = by;
    } else if (ay - by === 0) {
      yc1 = ay + dirLine*_.random(10, 100);
      xc1 = ax;
      yc2 = by + dirLine*_.random(10, 100);
      xc2 = bx;
    } else  {
      xc1 = _.random(ax, ax + dirLine*(bx - ax)*0.25);
      yc1 = _.random(ay, ay + dirLine*(by - ay)*0.25);
      xc2 = _.random(ax, bx - dirLine*(bx - ax)*0.25);
      yc2 = _.random(ay, by - dirLine*(by - ay)*0.25);
    }
    line.drawCubicLine(ax, ay, xc1, yc1, xc2, yc2, bx, by, lw, color),
    line.setZOrder(1000);
    this.nodeLine = line;
    this._node.push(line);

    const solidCircle = new CCNode;
    solidCircle.drawSolidCircle(bx, by, depth == -1 ? 16 : 12, color);
    solidCircle.setZOrder(9999);
    this._node.push(solidCircle);

    this.nodeDepth = new CCText;
    this.nodeDepth.setText(depth == -1 ? 'Max' : depth.toString());
    this.nodeDepth.setPosition(bx, by);
    this.nodeDepth.setColor(CCColorHex('#FFFFFF'));
    this.nodeDepth.setZOrder(10000);
    this._node.push(this.nodeDepth);
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

  setUserData(ax: number, ay: number, bx: number, by: number) {
    this._move = {ax, ay, bx, by};

  }

  setDepth(depth: number) {
    this._depth = depth;
    this.nodeDepth.setText(depth.toString());
  }
}

export default CCDirectorPiece;
