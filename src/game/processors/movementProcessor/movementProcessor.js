import { Processor, MathOps, Vector2, VectorOps } from '@flyer-engine/core';

const MOVEMENT_MSG = 'MOVEMENT';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';

class MovementProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
    const messageBus = options.messageBus;

    const messages = messageBus.get(MOVEMENT_MSG) || [];
    const movementVectors = messages.reduce((storage, message) => {
      const { gameObject, angle } = message;
      const gameObjectId = gameObject.getId();

      storage[gameObjectId] = storage[gameObjectId] || new Vector2(0, 0);
      storage[gameObjectId].add(VectorOps.getVectorByAngle(MathOps.degToRad(angle)));

      return storage;
    }, {});

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const { vector, speed, penalty } = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);
      vector.multiplyNumber(0);

      const movementVector = movementVectors[gameObjectId];
      if (!movementVector || (movementVector.x === 0 && movementVector.y === 0)) {
        return;
      }

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      movementVector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / movementVector.magnitude)
      );
      vector.add(movementVector);

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;
    });
  }
}

export default MovementProcessor;
