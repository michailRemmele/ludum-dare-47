import AIProcessor from 'game/processors/aiProcessor/aiProcessor';

const AI_COMPONENT_NAME = 'ai';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class AIProcessorPlugin {
  load(options) {
    const {
      createGameObjectObserver,
      store,
      messageBus,
    } = options;

    return new AIProcessor({
      gameObjectObserver: createGameObjectObserver({
        components: [
          AI_COMPONENT_NAME,
          COLLIDER_CONTAINER_COMPONENT_NAME,
        ],
      }),
      store,
      messageBus,
    });
  }
}
