import { GameOverSystem } from 'game/systems/game-over-system';

export class GameOverSystemPlugin {
  load(options) {
    return new GameOverSystem({
      gameObjectObserver: options.createGameObjectObserver({
        type: 'unit',
      }),
      messageBus: options.messageBus,
    });
  }
}
