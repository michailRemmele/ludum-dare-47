import { ItemsActivator } from 'game/systems/items-activator';

export class ItemsActivatorPlugin {
  load(options) {
    return new ItemsActivator({
      entityObserver: options.createEntityObserver({}),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
