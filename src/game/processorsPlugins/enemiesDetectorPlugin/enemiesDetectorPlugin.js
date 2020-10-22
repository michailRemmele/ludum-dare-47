import { ProcessorPlugin } from '@flyer-engine/core';

import EnemiesDetector from '../../processors/enemiesDetector/enemiesDetector';

class EnemiesDetectorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      store,
    } = options;

    return new EnemiesDetector({
      gameObjectObserver: gameObjectObserver,
      store: store,
    });
  }
}

export default EnemiesDetectorPlugin;
