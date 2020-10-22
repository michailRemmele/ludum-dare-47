import { ProcessorPlugin } from '@flyer-engine/core';

import Reaper from '../../processors/reaper/reaper';

class ReaperPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
      gameObjectDestroyer,
      allowedComponents,
      lifetime,
    } = options;

    return new Reaper({
      gameObjectObserver: gameObjectObserver,
      gameObjectDestroyer: gameObjectDestroyer,
      allowedComponents: allowedComponents,
      lifetime: lifetime,
    });
  }
}

export default ReaperPlugin;
