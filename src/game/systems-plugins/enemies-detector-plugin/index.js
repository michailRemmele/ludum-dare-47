import { EnemiesDetector } from 'game/systems/enemies-detector';

export class EnemiesDetectorPlugin {
  load(options) {
    const {
      createGameObjectObserver,
      store,
    } = options;

    return new EnemiesDetector({
      gameObjectObserver: createGameObjectObserver({
        type: 'unit',
      }),
      store: store,
    });
  }
}
