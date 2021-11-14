import DamageProcessor from 'game/processors/damageProcessor/damageProcessor';

export class DamageProcessorPlugin {
  load() {
    return new DamageProcessor();
  }
}
