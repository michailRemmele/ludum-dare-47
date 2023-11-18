import { System, ColliderContainer } from 'remiz';

import { AI } from '../../components';

import { strategies } from './ai-strategies';

export class AISystem extends System {
  constructor(options) {
    super();

    this.aiUnitsObserver = options.createGameObjectObserver({
      components: [
        AI,
        ColliderContainer,
      ],
    });
    this.gameObjectObserver = options.createGameObjectObserver({});
    this.messageBus = options.messageBus;

    this.playersStrategies = {};
  }

  mount() {
    this.aiUnitsObserver.subscribe('onadd', this._handleEntitiyAdd);
  }

  unmount() {
    this.aiUnitsObserver.unsubscribe('onadd', this._handleEntitiyAdd);
  }

  _handleEntitiyAdd = (gameObject) => {
    const gameObjectId = gameObject.getId();
    const ai = gameObject.getComponent(AI);

    this.playersStrategies[gameObjectId] = new strategies[ai.strategy](
      gameObject, this.gameObjectObserver, this.messageBus
    );
  };

  update(options) {
    const { deltaTime } = options;

    this.aiUnitsObserver.fireEvents();

    this.aiUnitsObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this.playersStrategies[gameObjectId].update(deltaTime);
    });
  }
}

AISystem.systemName = 'AISystem';
