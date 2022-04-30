const CONTROL_COMPONENT_NAME = 'keyboardControl';
const DEATH_MSG = 'DEATH';
const DEFEAT_MSG = 'DEFEAT';

export class GameOverSystem {
  constructor(options) {
    this._entityObserver = options.createEntityObserver({
      type: 'unit',
    });
    this.messageBus = options.messageBus;

    this._playerEntities = new Set();
    this._isGameOver = false;
  }

  mount() {
    this._entityObserver.subscribe('onadd', this._handleEntitiyAdd);
  }

  unmount() {
    this._entityObserver.unsubscribe('onadd', this._handleEntitiyAdd);
  }

  _handleEntitiyAdd = (entity) => {
    const entityId = entity.getId();
    const control = entity.getComponent(CONTROL_COMPONENT_NAME);

    if (control) {
      this._playerEntities.add(entityId);
    }
  };

  update() {
    if (this._isGameOver) {
      return;
    }

    this._entityObserver.fireEvents();

    const messages = this.messageBus.get(DEATH_MSG) || [];
    messages.forEach((message) => {
      const { entity } = message;
      this._playerEntities.delete(entity.getId());
    });

    if (this._playerEntities.size === 0) {
      this.messageBus.send({
        type: DEFEAT_MSG,
      });
      this._isGameOver = true;
    }
  }
}
