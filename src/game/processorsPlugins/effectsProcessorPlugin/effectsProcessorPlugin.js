import { ProcessorPlugin } from '@flyer-engine/core';

import { EffectsProcessor } from 'game/processors/effectsProcessor';

class EffectsProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      helpers,
      gameObjectObserver,
    } = options;

    const { effects } = await helpers.loadEffects();

    return new EffectsProcessor({
      gameObjectObserver,
      effects,
    });
  }
}

export default EffectsProcessorPlugin;
