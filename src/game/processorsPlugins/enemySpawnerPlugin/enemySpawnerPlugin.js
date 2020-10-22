import { ProcessorPlugin } from '@flyer-engine/core';

import EnemySpawner from '../../processors/enemySpawner/enemySpawner';

class EnemySpawnerPlugin extends ProcessorPlugin {
  async load(options) {
    return new EnemySpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.gameObjectObserver,
      store: options.store,
    });
  }
}

export default EnemySpawnerPlugin;
