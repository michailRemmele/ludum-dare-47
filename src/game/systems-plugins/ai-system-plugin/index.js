import { AISystem } from 'game/systems/ai-system';

const AI_COMPONENT_NAME = 'ai';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';

export class AISystemPlugin {
  load(options) {
    const {
      createGameObjectObserver,
      store,
      messageBus,
    } = options;

    return new AISystem({
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
