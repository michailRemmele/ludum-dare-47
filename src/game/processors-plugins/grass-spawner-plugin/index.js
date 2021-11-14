import GrassSpawner from 'game/processors/grassSpawner/grassSpawner';

export class GrassSpawnerPlugin {
  load(options) {
    return new GrassSpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.createGameObjectObserver({
        type: 'item',
      }),
      store: options.store,
    });
  }
}
