import GameOverProcessor from 'game/processors/gameOverProcessor/gameOverProcessor';

export class GameOverProcessorPlugin {
  load(options) {
    return new GameOverProcessor({
      gameObjectObserver: options.createGameObjectObserver({
        type: 'unit',
      }),
    });
  }
}
