import CraftProcessor from 'game/processors/craftProcessor/craftProcessor';

export class CraftProcessorPlugin {
  load(options) {
    return new CraftProcessor({
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
