import { MovementSystem } from 'game/systems/movement-system';

const MOVEMENT_COMPONENT_NAME = 'movement';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class MovementSystemPlugin {
  load(options) {
    return new MovementSystem({
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          MOVEMENT_COMPONENT_NAME,
          TRANSFORM_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
