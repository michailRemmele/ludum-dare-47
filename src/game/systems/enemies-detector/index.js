import { System, KeyboardControl } from 'remiz';

const PLAYER_KEY = 'player';

export class EnemiesDetector extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      type: 'unit',
    });
    this._store = options.store;

    this._playersCount = 0;
  }

  _scan() {
    this._playersCount = this._gameObjectObserver.size();

    this._store.set(PLAYER_KEY, null);

    this._gameObjectObserver.forEach((gameObject) => {
      if (gameObject.getComponent(KeyboardControl)) {
        this._store.set(PLAYER_KEY, gameObject);
      }
    });
  }

  mount() {
    this._scan();
  }

  update() {
    if (this._playersCount !== this._gameObjectObserver.size()) {
      this._scan();
    }
  }
}

EnemiesDetector.systemName = 'EnemiesDetector';
