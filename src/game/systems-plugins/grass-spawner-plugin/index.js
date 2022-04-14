import { GrassSpawner } from 'game/systems/grass-spawner';

export class GrassSpawnerPlugin {
  load(options) {
    return new GrassSpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.createGameObjectObserver({
        type: 'item',
      }),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
