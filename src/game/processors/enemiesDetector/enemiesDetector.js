import { Processor } from '@flyer-engine/core';

const CONTROL_COMPONENT_NAME = 'keyboardControl';

const PLAYER_KEY = 'player';

class EnemiesDetector extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;

    this._playersCount = 0;
  }

  _scan() {
    this._playersCount = this._gameObjectObserver.size();

    this._store.set(PLAYER_KEY, null);

    this._gameObjectObserver.forEach((gameObject) => {
      if (gameObject.getComponent(CONTROL_COMPONENT_NAME)) {
        this._store.set(PLAYER_KEY, gameObject);
      }
    });
  }

  processorDidMount() {
    this._scan();
  }

  process() {
    if (this._playersCount !== this._gameObjectObserver.size()) {
      this._scan();
    }
  }
}

export default EnemiesDetector;
