import { System, KeyboardControl } from 'remiz';

const DEATH_MSG = 'DEATH';
const DEFEAT_MSG = 'DEFEAT';

export class GameOverSystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      type: 'unit',
    });
    this.messageBus = options.messageBus;

    this._playerGameObjects = new Set();
    this._isGameOver = false;
  }

  mount() {
    this._gameObjectObserver.subscribe('onadd', this._handleEntitiyAdd);
  }

  unmount() {
    this._gameObjectObserver.unsubscribe('onadd', this._handleEntitiyAdd);
  }

  _handleEntitiyAdd = (gameObject) => {
    const gameObjectId = gameObject.getId();
    const control = gameObject.getComponent(KeyboardControl);

    if (control) {
      this._playerGameObjects.add(gameObjectId);
    }
  };

  update() {
    if (this._isGameOver) {
      return;
    }

    this._gameObjectObserver.fireEvents();

    const messages = this.messageBus.get(DEATH_MSG) || [];
    messages.forEach((message) => {
      const { gameObject } = message;
      this._playerGameObjects.delete(gameObject.getId());
    });

    if (this._playerGameObjects.size === 0) {
      this.messageBus.send({
        type: DEFEAT_MSG,
      });
      this._isGameOver = true;
    }
  }
}

GameOverSystem.systemName = 'GameOverSystem';
