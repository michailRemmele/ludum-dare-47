import { Processor } from '@flyer-engine/core';

const CONTROL_COMPONENT_NAME = 'keyboardControl';
const KILL_MSG = 'KILL';
const DEFEAT_MSG = 'DEFEAT';

class GameOverProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;

    this._playerGameObjects = new Set();
    this._isGameOver = false;
  }

  _processAddedGameObjects() {
    this._gameObjectObserver.getLastAdded().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const control = gameObject.getComponent(CONTROL_COMPONENT_NAME);

      if (control) {
        this._playerGameObjects.add(gameObjectId);
      }
    });
  }

  process(options) {
    const messageBus = options.messageBus;

    if (this._isGameOver) {
      return;
    }

    this._processAddedGameObjects();

    const messages = messageBus.get(KILL_MSG) || [];
    messages.forEach((message) => {
      const { gameObject } = message;
      this._playerGameObjects.delete(gameObject.getId());
    });

    if (this._playerGameObjects.size === 0) {
      messageBus.send({
        type: DEFEAT_MSG,
      });
      this._isGameOver = true;
    }
  }
}

export default GameOverProcessor;
