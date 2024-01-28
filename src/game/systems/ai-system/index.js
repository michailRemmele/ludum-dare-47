import {
  System,
  ColliderContainer,
  GameObject,
  GameObjectObserver,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { AI } from '../../components';

import { strategies } from './ai-strategies';

export class AISystem extends System {
  constructor(options) {
    super();

    this.aiUnitsObserver = new GameObjectObserver(options.scene, {
      components: [
        AI,
        ColliderContainer,
      ],
    });
    this.gameObjectObserver = new GameObjectObserver(options.scene);

    this.playersStrategies = {};
  }

  mount() {
    this.aiUnitsObserver.forEach(this._handleAddGameObject);
    this.aiUnitsObserver.addEventListener(AddGameObject, this._handleAddGameObject);
    this.aiUnitsObserver.addEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  unmount() {
    this.aiUnitsObserver.forEach(this._handleRemoveGameObject);
    this.aiUnitsObserver.removeEventListener(AddGameObject, this._handleAddGameObject);
    this.aiUnitsObserver.removeEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  _handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;

    const ai = gameObject.getComponent(AI);

    this.playersStrategies[gameObject.id] = new strategies[ai.strategy](
      gameObject, this.gameObjectObserver
    );
  };

  _handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;

    delete this.playersStrategies[gameObject.id];
  };

  update(options) {
    const { deltaTime } = options;

    this.aiUnitsObserver.forEach((gameObject) => {
      this.playersStrategies[gameObject.id].update(deltaTime);
    });
  }
}

AISystem.systemName = 'AISystem';
