import { ProcessorPlugin } from '@flyer-engine/core';

import AutoAimingProcessor from 'game/processors/autoAimingProcessor/autoAimingProcessor';

class AutoAimingProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new AutoAimingProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default AutoAimingProcessorPlugin;
