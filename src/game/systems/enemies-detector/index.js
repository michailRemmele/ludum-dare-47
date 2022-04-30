const CONTROL_COMPONENT_NAME = 'keyboardControl';

const PLAYER_KEY = 'player';

export class EnemiesDetector {
  constructor(options) {
    this._entityObserver = options.createEntityObserver({
      type: 'unit',
    });
    this._store = options.store;

    this._playersCount = 0;
  }

  _scan() {
    this._playersCount = this._entityObserver.size();

    this._store.set(PLAYER_KEY, null);

    this._entityObserver.forEach((entity) => {
      if (entity.getComponent(CONTROL_COMPONENT_NAME)) {
        this._store.set(PLAYER_KEY, entity);
      }
    });
  }

  mount() {
    this._scan();
  }

  update() {
    if (this._playersCount !== this._entityObserver.size()) {
      this._scan();
    }
  }
}
