import {
  MathOps,
  Vector2,
  VectorOps,
  System,
  Transform,
} from 'remiz';

import { Movement, ViewDirection } from '../../components';

const MOVEMENT_MSG = 'MOVEMENT';

const SPEED_DIVIDER = 0.4;
const MIN_SPEED = 0.5;
const MAX_SPEED = 1;

export class MovementSystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        Movement,
        Transform,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const { vector, speed, penalty } = gameObject.getComponent(Movement);
      vector.multiplyNumber(0);

      const messages = this.messageBus.getById(MOVEMENT_MSG, gameObjectId) || [];
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

      const transform = gameObject.getComponent(Transform);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      movementVector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / movementVector.magnitude) * intension
      );
      vector.add(movementVector);

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;

      const viewDirection = gameObject.getComponent(ViewDirection);

      viewDirection.x = vector.x;
      viewDirection.y = vector.y;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
