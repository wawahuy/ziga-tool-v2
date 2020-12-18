

class CCLine {
  node: any;

  constructor() {
    this.node = new cc.DrawNode();
  }

  set(x1: number, y1: number, x2: number, y2: number, width: number, color: any) {
    this.node.drawSegment(cc.p(x1,y1), cc.p(x2,y2), width, color);
  }
}

export default CCLine;
