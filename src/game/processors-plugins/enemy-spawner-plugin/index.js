import EnemySpawner from 'game/processors/enemySpawner/enemySpawner';

const AI_COMPONENT_NAME = 'ai';

export class EnemySpawnerPlugin {
  load(options) {
    return new EnemySpawner({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          AI_COMPONENT_NAME,
        ],
      }),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
