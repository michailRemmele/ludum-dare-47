import { ProcessorPlugin } from '@flyer-engine/core';

import DamageProcessor from 'game/processors/damageProcessor/damageProcessor';

class DamageProcessorPlugin extends ProcessorPlugin {
  async load() {
    return new DamageProcessor();
  }
}

export default DamageProcessorPlugin;
