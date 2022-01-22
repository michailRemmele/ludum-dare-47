import DamageProcessor from 'game/processors/damageProcessor/damageProcessor';

export class DamageProcessorPlugin {
  load(options) {
    return new DamageProcessor({
      messageBus: options.messageBus,
    });
  }
}
