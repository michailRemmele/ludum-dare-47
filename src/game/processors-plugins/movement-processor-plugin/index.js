import MovementProcessor from 'game/processors/movementProcessor/movementProcessor';

const MOVEMENT_COMPONENT_NAME = 'movement';
const TRANSFORM_COMPONENT_NAME = 'transform';

export class MovementProcessorPlugin {
  load(options) {
    return new MovementProcessor({
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
