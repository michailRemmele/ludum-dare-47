import {
  System,
  GameObject,
  GameObjectObserver,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { EventType } from '../../../events';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;

export class Reaper extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene);
    this._allowedComponents = options.allowedComponents.reduce((storage, componentName) => {
      storage[componentName] = true;
      return storage;
    }, {});
    this._lifetime = options.lifetime;

    this._graveyard = [];
    this._timeCounter = 0;
  }

  mount() {
    this.gameObjectObserver.forEach(this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  unmount() {
    this.gameObjectObserver.forEach(this._handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  _handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(EventType.Kill, this._handleKill);
  };

  _handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(EventType.Kill, this._handleKill);
  };

  _handleKill = (value) => {
    const gameObject = value instanceof GameObject ? value : value.target;

    gameObject.getComponents().forEach((component) => {
      if (!this._allowedComponents[component.constructor.componentName]) {
        gameObject.removeComponent(component.constructor);
      }
    });

    this._graveyard.push({
      gameObject,
      lifetime: this._lifetime,
    });

    gameObject.emit(EventType.Death);

    gameObject.getChildren().forEach((child) => this._handleKill(child));
  };

  update(options) {
    const { deltaTime } = options;

    this._timeCounter += deltaTime;
    if (this._timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this._graveyard = this._graveyard.filter((entry) => {
        entry.lifetime -= this._timeCounter;

        if (entry.lifetime <= 0) {
          entry.gameObject.destroy();

          return false;
        }

        return true;
      });

      this._timeCounter = 0;
    }
  }
}

Reaper.systemName = 'Reaper';
