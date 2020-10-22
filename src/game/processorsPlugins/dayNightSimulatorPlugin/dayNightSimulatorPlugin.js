import { ProcessorPlugin } from '@flyer-engine/core';

import DayNightSimulator from '../../processors/dayNightSimulator/dayNightSimulator';

class DayNightSimulatorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      store,
      dayLength,
      startTime,
    } = options;

    return new DayNightSimulator({
      store,
      dayLength,
      startTime,
    });
  }
}

export default DayNightSimulatorPlugin;
