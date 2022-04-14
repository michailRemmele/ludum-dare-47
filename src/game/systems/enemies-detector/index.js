const CONTROL_COMPONENT_NAME = 'keyboardControl';

const PLAYER_KEY = 'player';

export class EnemiesDetector {
  constructor(options) {
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

  systemDidMount() {
    this._scan();
  }

  update() {
    if (this._playersCount !== this._gameObjectObserver.size()) {
      this._scan();
    }
  }
}
