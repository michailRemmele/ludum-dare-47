import { ProcessorPlugin } from '@flyer-engine/core';

import FightSystem from 'game/processors/fightSystem/fightSystem';

class FightSystemPlugin extends ProcessorPlugin {
  async load(options) {
    return new FightSystem({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
    });
  }
}

export default FightSystemPlugin;
