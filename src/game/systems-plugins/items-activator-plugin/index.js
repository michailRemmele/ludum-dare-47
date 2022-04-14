import { ItemsActivator } from 'game/systems/items-activator';

export class ItemsActivatorPlugin {
  load(options) {
    return new ItemsActivator({
      gameObjectObserver: options.createGameObjectObserver({}),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
