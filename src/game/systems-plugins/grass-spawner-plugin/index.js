import { GrassSpawner } from 'game/systems/grass-spawner';

export class GrassSpawnerPlugin {
  load(options) {
    return new GrassSpawner({
      entitySpawner: options.entitySpawner,
      entityObserver: options.createEntityObserver({
        type: 'item',
      }),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
