import { GameOverSystem } from 'game/systems/game-over-system';

export class GameOverSystemPlugin {
  load(options) {
    return new GameOverSystem({
      entityObserver: options.createEntityObserver({
        type: 'unit',
      }),
      messageBus: options.messageBus,
    });
  }
}
