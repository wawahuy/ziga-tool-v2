import systeminformation, { Systeminformation } from 'systeminformation';

class System {
  cpu!: Systeminformation.CpuData;
  cpuFlag!: string;
  memory!: Systeminformation.MemData;

  private constructor() {}

  static async get() {
    const instance = new System;
    await instance._load();
    return instance;
  }

  private async _load() {
    this.cpu = await systeminformation.cpu();
    this.cpuFlag = await systeminformation.cpuFlags();
    this.memory = await systeminformation.mem();
  }

  isSupportBMI2() {
    return this.cpuFlag?.indexOf('bmi2') > -1;
  }
}

export default System;
