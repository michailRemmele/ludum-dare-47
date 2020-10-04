import { ProcessorPlugin } from '@flyer-engine/core';

import GameOverProcessor from 'game/processors/gameOverProcessor/gameOverProcessor';

class GameOverProcessorPlugin extends ProcessorPlugin {
  async load(options) {
    const {
      gameObjectObserver,
    } = options;

    return new GameOverProcessor({
      gameObjectObserver,
    });
  }
}

export default GameOverProcessorPlugin;
