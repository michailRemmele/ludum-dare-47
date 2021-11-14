import { MathOps, Vector2, VectorOps } from '@flyer-engine/core';

const MOVEMENT_MSG = 'MOVEMENT';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MOVEMENT_COMPONENT_NAME = 'movement';
const VIEW_DIRECTION_COMPONENT_NAME = 'viewDirection';

const SPEED_DIVIDER = 0.4;
const MIN_SPEED = 0.5;
const MAX_SPEED = 1;

class MovementProcessor {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;
    const messageBus = options.messageBus;

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const { vector, speed, penalty } = gameObject.getComponent(MOVEMENT_COMPONENT_NAME);
      vector.multiplyNumber(0);

      const messages = messageBus.getById(MOVEMENT_MSG, gameObjectId) || [];
      const { movementVector, intension } = messages.reduce((storage, message) => {
        const { angle, x, y } = message;

        if (x && y) {
          const controlIntension = MathOps.getDistanceBetweenTwoPoints(0, x, 0, y);
          storage.intension = controlIntension < SPEED_DIVIDER ? MIN_SPEED : MAX_SPEED;
        }

        storage.movementVector.add(VectorOps.getVectorByAngle(MathOps.degToRad(angle)));

        return storage;
      }, { movementVector: new Vector2(0, 0), intension: 1 });

      if (!movementVector || (movementVector.x === 0 && movementVector.y === 0)) {
        return;
      }

      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      movementVector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / movementVector.magnitude) * intension
      );
      vector.add(movementVector);

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;

      const viewDirection = gameObject.getComponent(VIEW_DIRECTION_COMPONENT_NAME);

      viewDirection.x = vector.x;
      viewDirection.y = vector.y;
    });
  }
}

export default MovementProcessor;
