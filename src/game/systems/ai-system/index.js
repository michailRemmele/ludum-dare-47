import aiStrategies from './aiStrategies';

const AI_COMPONENT_NAME = 'ai';

export class AISystem {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;
    this.messageBus = options.messageBus;

    this.playersStrategies = {};
  }

  systemDidMount() {
    this._gameObjectObserver.subscribe('onadd', this._handleGameObjectAdd);
  }

  systemWillUnmount() {
    this._gameObjectObserver.unsubscribe('onadd', this._handleGameObjectAdd);
  }

  _handleGameObjectAdd = (gameObject) => {
    const gameObjectId = gameObject.getId();
    const ai = gameObject.getComponent(AI_COMPONENT_NAME);

    this.playersStrategies[gameObjectId] = new aiStrategies[ai.strategy](
      gameObject, this._store, this.messageBus
    );
  };

  update(options) {
    const { deltaTime } = options;

    this._gameObjectObserver.fireEvents();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this.playersStrategies[gameObjectId].update(deltaTime);
    });
  }
}
