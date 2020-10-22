import { ProcessorPlugin } from '@flyer-engine/core';

import FightProcessor from '../../processors/fightProcessor/fightProcessor';

class FightProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    return new FightProcessor({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default FightProcessorPlugin;
