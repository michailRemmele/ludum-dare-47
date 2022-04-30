import aiStrategies from './aiStrategies';

const AI_COMPONENT_NAME = 'ai';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class AISystem {
  constructor(options) {
    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        AI_COMPONENT_NAME,
        COLLIDER_CONTAINER_COMPONENT_NAME,
      ],
    });
    this._store = options.store;
    this.messageBus = options.messageBus;

    this.playersStrategies = {};
  }

  mount() {
    this._gameObjectObserver.subscribe('onadd', this._handleEntitiyAdd);
  }

  unmount() {
    this._gameObjectObserver.unsubscribe('onadd', this._handleEntitiyAdd);
  }

  _handleEntitiyAdd = (gameObject) => {
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
