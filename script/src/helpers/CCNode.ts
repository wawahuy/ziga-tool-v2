import GameInjectService from "services/GameInjectService";
import { IDraw } from "./IDraw";


class CCNode implements IDraw {
  node: any;

  constructor() {
    this.node = new cc.DrawNode();
  }


  setZOrder(index: number) {
    this.node.setZOrder(index);
  }

  setLineWidth(size: number) {
    this.node.setLineWidth(size);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number, width: number, color: any) {
    this.node.drawSegment(cc.p(x1,y1), cc.p(x2,y2), width, color);
  }

  drawCircle(x: number, y: number, w: number, lw: number, color: any) {
    this.node.drawCircle(cc.p(x, y), w, 90*3.14/360, 90, false, lw, color);
  }

  drawSolidCircle(x: number, y: number, w: number, color: any) {
    this.drawCircle(x, y, w, 1, color);
    var lastElement = this.node._buffer[this.node._buffer.length - 1];
    lastElement.isFill = true;
    lastElement.fillColor = color;
  }

  drawCubicLine(
    x1: number, y1: number,
    xc1: number, yc1: number,
    xc2: number, yc2: number,
    x2: number, y2: number,
    w: number,
    color: any
    ) {
      this.node.drawCubicBezier(
        cc.p(x1, y1),
        cc.p(xc1, yc1),
        cc.p(xc2, yc2),
        cc.p(x2, y2),
        90,
        w,
        color
      )
  }

  add(gameInject: GameInjectService): void {
    this.node.retain();
    this.node.removeFromParent();
    gameInject.addChild(this.node);
    this.node.release();
  }
  remove(gameInject: GameInjectService): void {
    gameInject.removeChild(this.node);
  }
}

export default CCNode;
