import { ProcessorPlugin } from '@flyer-engine/core';

import GrassSpawner from 'game/processors/grassSpawner/grassSpawner';

class GrassSpawnerPlugin extends ProcessorPlugin {
  async load(options) {
    return new GrassSpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
      store: options.store,
    });
  }
}

export default GrassSpawnerPlugin;
