import { EUCCIOption, UCCI } from './ucci';
import System from './system';

class Player {
  engine!: UCCI;
  
  constructor() {
    this.engine = new UCCI;
  }

  async init() {
    const info = await System.get();
    const threads = info.cpu.cores;
    const memory = Math.round(info.memory.free/1024/1024*0.7);
    
    this.engine.on('ucciok', () => {
      this.engine.setOption(EUCCIOption.Hash, memory);
      this.engine.setOption(EUCCIOption.Threads, threads);
      this.engine.ready();
    });
  }
}

export default System;