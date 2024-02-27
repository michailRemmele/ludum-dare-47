import {
  Actor,
  System,
  ActorCollection,
} from 'remiz';

import { EventType } from '../../../events';

const GRAVEYARD_CLEAN_FREQUENCY = 1000;

export class Reaper extends System {
  constructor(options) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene);
    this._allowedComponents = options.allowedComponents.reduce((storage, componentName) => {
      storage[componentName] = true;
      return storage;
    }, {});
    this._lifetime = options.lifetime;

    this._graveyard = [];
    this._timeCounter = 0;
  }

  mount() {
    this.scene.addEventListener(EventType.Kill, this._handleKill);
  }

  unmount() {
    this.scene.removeEventListener(EventType.Kill, this._handleKill);
  }

  _handleKill = (value) => {
    const actor = value instanceof Actor ? value : value.target;

    actor.getComponents().forEach((component) => {
      if (!this._allowedComponents[component.constructor.componentName]) {
        actor.removeComponent(component.constructor);
      }
    });

    this._graveyard.push({
      actor,
      lifetime: this._lifetime,
    });

    actor.emit(EventType.Death);

    actor.children.forEach((child) => this._handleKill(child));
  };

  update(options) {
    const { deltaTime } = options;

    this._timeCounter += deltaTime;
    if (this._timeCounter >= GRAVEYARD_CLEAN_FREQUENCY) {
      this._graveyard = this._graveyard.filter((entry) => {
        entry.lifetime -= this._timeCounter;

        if (entry.lifetime <= 0) {
          entry.actor.remove();

          return false;
        }

        return true;
      });

      this._timeCounter = 0;
    }
  }
}

Reaper.systemName = 'Reaper';
