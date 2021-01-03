import { ProcessorPlugin } from '@flyer-engine/core';

import MovementProcessor from 'game/processors/movementProcessor/movementProcessor';

class MovementProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new MovementProcessor({
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default MovementProcessorPlugin;
