import { System, ColliderContainer } from 'remiz';

import { AI } from '../../components';

import { strategies } from './ai-strategies';

export class AISystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        AI,
        ColliderContainer,
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
    const ai = gameObject.getComponent(AI);

    this.playersStrategies[gameObjectId] = new strategies[ai.strategy](
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

AISystem.systemName = 'AISystem';
