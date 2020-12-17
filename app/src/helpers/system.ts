import systeminformation, { Systeminformation } from 'systeminformation';

class System {
  cpu!: Systeminformation.CpuData;
  memory!: Systeminformation.MemData;

  private constructor() {}

  static async get() {
    const instance = new System;
    await instance._load();
    return instance;
  }

  private async _load() {
    this.cpu = await systeminformation.cpu();
    this.memory = await systeminformation.mem();
  }
}

export default System;
