import aiStrategies from './aiStrategies';

const AI_COMPONENT_NAME = 'ai';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class AISystem {
  constructor(options) {
    this._entityObserver = options.createEntityObserver({
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
    this._entityObserver.subscribe('onadd', this._handleEntitiyAdd);
  }

  unmount() {
    this._entityObserver.unsubscribe('onadd', this._handleEntitiyAdd);
  }

  _handleEntitiyAdd = (entity) => {
    const entityId = entity.getId();
    const ai = entity.getComponent(AI_COMPONENT_NAME);

    this.playersStrategies[entityId] = new aiStrategies[ai.strategy](
      entity, this._store, this.messageBus
    );
  };

  update(options) {
    const { deltaTime } = options;

    this._entityObserver.fireEvents();

    this._entityObserver.forEach((entity) => {
      const entityId = entity.getId();
      this.playersStrategies[entityId].update(deltaTime);
    });
  }
}
