import fs from 'fs';
import { EventEmitter } from 'events';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { pathEngineUCCI } from "./common";

export interface IUCCIConfig {
  path?: string;
}

export enum EUCCIOption {
  Hash = 'Hash',
  Threads = 'Threads'
}

const defaultOptions: IUCCIConfig = {
  path: pathEngineUCCI() 
}

export declare interface UCCI {
  on(event: 'open', listener: () => void): this;
  on(event: 'data', listener: (chunk: any) => void): this;
  on(event: 'command', listener: (command: string) => void): this;
  on(event: 'exit', listener: () => void): this;
  on(event: 'error', listener: (code: number) => void): this;
  on(event: 'ucciok', listener: () => void): this;
  on(event: 'readyok', listener: () => void): this;
  on(event: 'bestmove', listener: (move: string, ponder: string) => void): this;
  on(event: 'infomove', listener: (depth: number, moves: string) => void): this;
}

export class UCCI extends EventEmitter {
  private _options: IUCCIConfig = defaultOptions;
  private _process: ChildProcessWithoutNullStreams | undefined;

  constructor(options?: IUCCIConfig) {
    super();
    if (options) {
      this._options = options;
    }
  }

  checkPath() {
    return this._options.path && fs.existsSync(this._options.path);
  }

  load() {
    if (this._options.path && !this._process) {
      this._process = spawn(this._options.path);
      this._process.stdout.on('data', this._onProcessData.bind(this));
      this._process.stderr.on('error', this._onProcessError.bind(this));
      this._process.on('exit', this._onProcessExit.bind(this));
      return true;
    }
    return false;
  }

  ready() {
    this.command('isready');
  }

  quit() {
    this._process?.kill();
  }

  setOption(type: EUCCIOption, value: any) {
    this.command(`setoption ${type} ${value}`);
  }

  command(cmd: string) {
    this.emit('command', cmd);
    this._process?.stdin.write(cmd + "\r\n");
  }

  position(fen: string) {
  }

  go() {
  }

  stopMove() {
    this.command('stop');
  }

  private _onProcessData(chunk: any) {
    this.emit('data', chunk);
    const res = chunk?.toString('utf-8');
    if (res) {
      const lines = res.split("\r\n");
      lines.map((line: string) => {
        const cmds = line.split(" ");
        if (cmds.length) {
          const [ func, ...args ] = cmds;
          this._onCMD(func, args);
        }
      });     
    }
  }

  private _onProcessError(code: number) {
    this.emit('error', code);
  }

  private _onProcessExit() {
    this.emit('exit');
  }

  private _onCMD(func: string, args: any[]) {
    switch (func) {
      case 'ucciok':
        this.emit('ucciok');
        break;

      case 'readyok':
        this.emit('readyok');
        break;

      case 'bestmove':
        this.emit(
          'bestmove', 
          args.length >= 1 ? args[0] : null, 
          args.length > 2 ? args[2] : null
          );
        break;

      case 'info':
        const indexDepth = args.indexOf('depth') + 1;
        const indexPV = args.indexOf('pv') + 1;
        const sizeArgs = args.length;
        if (indexDepth > 0 && indexPV > 0 && indexDepth < sizeArgs && indexPV < sizeArgs) {
          const numberDepth = args[indexDepth];
          this.emit('infomove', numberDepth, args.slice(indexPV, sizeArgs));
        }
        break;
    }
  }
}

(async () => {
  const engine = new UCCI;
  engine.on('readyok', () => console.log('ready'));
  engine.on('open', () => console.log('open'));
  engine.on('exit', () => console.log('quit'));
  engine.on('data', (chunk: any) => console.log(chunk.toString('utf-8')));
  engine.on('command', (command: string) => console.log(">>>>" + command));

  if (engine.checkPath()) {
    engine.load();
    engine.command('ucci');
    engine.on('bestmove', (move) => console.log(move));
    engine.on('infomove', (depth, move) => console.log(depth, move));

    engine.on('ucciok', () => {
      engine.setOption(EUCCIOption.Hash, 2048);
      engine.setOption(EUCCIOption.Threads, 8);
      engine.ready();
    });

    engine.on('readyok', () => {
      engine.command('position startpos');
      engine.command('go depth 20');
      setTimeout(() => {
        engine.stopMove();
      }, 10000);
      setTimeout(() => {
        engine.quit();
      }, 15000);
    });
  }
})();