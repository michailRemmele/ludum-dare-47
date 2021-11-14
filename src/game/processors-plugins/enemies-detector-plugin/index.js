import EnemiesDetector from 'game/processors/enemiesDetector/enemiesDetector';

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
