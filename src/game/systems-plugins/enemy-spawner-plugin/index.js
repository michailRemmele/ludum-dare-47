import { EnemySpawner } from 'game/systems/enemy-spawner';

const AI_COMPONENT_NAME = 'ai';

export class EnemySpawnerPlugin {
  load(options) {
    return new EnemySpawner({
      entitySpawner: options.entitySpawner,
      entityObserver: options.createEntityObserver({
        components: [
          AI_COMPONENT_NAME,
        ],
      }),
      store: options.store,
      messageBus: options.messageBus,
    });
  }
}
