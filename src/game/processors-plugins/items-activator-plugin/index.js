import ItemsActivator from 'game/processors/itemsActivator/itemsActivator';

export class ItemsActivatorPlugin {
  load(options) {
    return new ItemsActivator({
      gameObjectObserver: options.createGameObjectObserver({}),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
