import aiStrategies from './aiStrategies';

const AI_COMPONENT_NAME = 'ai';

class AIProcessor {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this._store = options.store;
    this.messageBus = options.messageBus;

    this.playersStrategies = {};
  }

  _processAddedGameObjects() {
    this._gameObjectObserver.getLastAdded().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const ai = gameObject.getComponent(AI_COMPONENT_NAME);

      this.playersStrategies[gameObjectId] = new aiStrategies[ai.strategy](
        gameObject, this._store, this.messageBus
      );
    });
  }

  process(options) {
    const { deltaTime } = options;

    this._processAddedGameObjects();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this.playersStrategies[gameObjectId].update(deltaTime);
    });
  }
}

export default AIProcessor;
