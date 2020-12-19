import GameInjectService from 'services/GameInjectService';
import { IDraw } from './IDraw';

class CCText implements IDraw {
  node: any;

  constructor() {
    this.node = new BkLabel("", "Arial", 16);
  }

  setText(text: string) {
    this.node.setText(text);
  }

  setPosition(x: number, y: number) {
    this.node.setPosition(x, y);
  }

  setZOrder(index: number) {
    this.node.setZOrder(index);
  }

  setColor(color: any) {
    this.node.setColor(color);
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

export default CCText;
