const KILL_MSG = 'KILL';
const DEATH_MSG = 'DEATH';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;

export class Reaper {
  constructor(options) {
    this._entityDestroyer = options.entityDestroyer;
    this.messageBus = options.messageBus;
    this._allowedComponents = options.allowedComponents.reduce((storage, componentName) => {
      storage[componentName] = true;
      return storage;
    }, {});
    this._lifetime = options.lifetime;

    this._graveyard = [];
    this._timeCounter = 0;
  }

  _killEntitiy(entity) {
    entity.getComponentNamesList().forEach((componentName) => {
      if (!this._allowedComponents[componentName]) {
        entity.removeComponent(componentName);
      }
    });

    this._graveyard.push({
      entity,
      lifetime: this._lifetime,
    });

    this.messageBus.send({
      type: DEATH_MSG,
      id: entity.getId(),
      entity,
    });

    entity.getChildren().forEach((child) => this._killEntitiy(child));
  }

  update(options) {
    const { deltaTime } = options;

    const killMessages = this.messageBus.get(KILL_MSG) || [];
    killMessages.forEach((message) => {
      const { entity } = message;

      this._killEntitiy(entity);
    });

    this._timeCounter += deltaTime;
    if (this._timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this._graveyard = this._graveyard.filter((entry) => {
        entry.lifetime -= this._timeCounter;

        if (entry.lifetime <= 0) {
          this._entityDestroyer.destroy(entry.entity);

          return false;
        }

        return true;
      });

      this._timeCounter = 0;
    }
  }
}
