const KILL_MSG = 'KILL';
const DEATH_MSG = 'DEATH';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;

class Reaper {
  constructor(options) {
    this._gameObjectDestroyer = options.gameObjectDestroyer;
    this._allowedComponents = options.allowedComponents.reduce((storage, componentName) => {
      storage[componentName] = true;
      return storage;
    }, {});
    this._lifetime = options.lifetime;

    this._graveyard = [];
    this._timeCounter = 0;
  }

  _killGameObject(gameObject, messageBus) {
    gameObject.getComponentNamesList().forEach((componentName) => {
      if (!this._allowedComponents[componentName]) {
        gameObject.removeComponent(componentName);
      }
    });

    this._graveyard.push({
      gameObject,
      lifetime: this._lifetime,
    });

    messageBus.send({
      type: DEATH_MSG,
      id: gameObject.getId(),
      gameObject,
    });

    gameObject.getChildren().forEach((child) => this._killGameObject(child, messageBus));
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    const killMessages = messageBus.get(KILL_MSG) || [];
    killMessages.forEach((message) => {
      const { gameObject } = message;

      this._killGameObject(gameObject, messageBus);
    });

    this._timeCounter += deltaTime;
    if (this._timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this._graveyard = this._graveyard.filter((entry) => {
        entry.lifetime -= this._timeCounter;

        if (entry.lifetime <= 0) {
          this._gameObjectDestroyer.destroy(entry.gameObject);

          return false;
        }

        return true;
      });

      this._timeCounter = 0;
    }
  }
}

export default Reaper;
