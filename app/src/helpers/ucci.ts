import fs from 'fs';
import { pathEngineUCCI } from "./common";


export interface IOptionUCCI {
  path?: string;
}

const defaultOptions: IOptionUCCI = {
  path: pathEngineUCCI() 
}

export default class UCCI {
  private _options: IOptionUCCI = defaultOptions;

  constructor(options?: IOptionUCCI) {
    if (options) {
      this._options = options;
    }
  }

  checkPath() {
    return this._options.path && fs.existsSync(this._options.path);
  }
}