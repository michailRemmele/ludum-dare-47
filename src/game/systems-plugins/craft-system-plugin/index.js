import { CraftSystem } from 'game/systems/craft-system';

export class CraftSystemPlugin {
  load(options) {
    return new CraftSystem({
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
