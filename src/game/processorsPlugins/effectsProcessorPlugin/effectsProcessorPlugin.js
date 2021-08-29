import { ProcessorPlugin } from '@flyer-engine/core';

import { EffectsProcessor } from 'game/processors/effectsProcessor';

class EffectsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      helpers,
      gameObjectObserver,
      gameObjectSpawner,
    } = options;

    const { effects } = await helpers.loadEffects();

    return new EffectsProcessor({
      gameObjectObserver,
      gameObjectSpawner,
      effects,
    });
  }
}

export default EffectsProcessorPlugin;
