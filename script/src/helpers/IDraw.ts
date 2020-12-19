import { add } from "lodash";
import GameInjectService from "services/GameInjectService";

export interface IDraw {
  node: any;
  add(gameInject: GameInjectService): void;
  remove(gameInject: GameInjectService): void;
}
