import {
  System,
  GameObject,
  GameObjectObserver,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { EventType } from '../../../events';
import { Health } from '../../components';

export class DamageSystem extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [
        Health,
      ],
    });
  }

  mount() {
    this.gameObjectObserver.forEach(this.handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this.handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this.handleRemoveGameObject);
  }

  unmount() {
    this.gameObjectObserver.forEach(this.handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this.handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this.handleRemoveGameObject);
  }

  handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(EventType.Damage, this.handleDamage);
  }

  handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(EventType.Damage, this.handleDamage);
  }

  handleDamage = (event) => {
    const { target, value } = event;

    const health = target.getComponent(Health);

    if (!health) {
      return;
    }

    health.points -= Math.round(value);

    if (health.points <= 0) {
      health.points = 0;
      target.emit(EventType.Kill);
    }
  }
}

DamageSystem.systemName = 'DamageSystem';
