import { EnemiesDetector } from 'game/systems/enemies-detector';

export class EnemiesDetectorPlugin {
  load(options) {
    const {
      createEntityObserver,
      store,
    } = options;

    return new EnemiesDetector({
      entityObserver: createEntityObserver({
        type: 'unit',
      }),
      store: store,
    });
  }
}
