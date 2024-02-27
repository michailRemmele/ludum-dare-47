import {
  ActorCollection,
  MathOps,
  VectorOps,
  System,
  Transform,
} from 'remiz';

import { EventType } from '../../../events';
import { Movement, ViewDirection } from '../../components';

const SPEED_DIVIDER = 0.4;
const MIN_SPEED = 0.5;
const MAX_SPEED = 1;

export class MovementSystem extends System {
  constructor(options) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Movement,
        Transform,
      ],
    });
  }

  mount() {
    this.scene.addEventListener(EventType.Movement, this._handleMovement);
  }

  unmount() {
    this.scene.removeEventListener(EventType.Movement, this._handleMovement);
  }

  _handleMovement = (event) => {
    const { target, angle, x, y } = event;

    const movement = target.getComponent(Movement);

    if (!movement.isMoving) {
      movement.vector.multiplyNumber(0);
      movement.isMoving = true;
    }

    if (x && y) {
      const controlIntension = MathOps.getDistanceBetweenTwoPoints(0, x, 0, y);
      movement.intension = controlIntension < SPEED_DIVIDER ? MIN_SPEED : MAX_SPEED;
    } else {
      movement.intension = 1;
    }

    movement.vector.add(VectorOps.getVectorByAngle(MathOps.degToRad(angle)));
  };

  update(options) {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorCollection.forEach((actor) => {
      const movement = actor.getComponent(Movement);
      const { vector, speed, penalty, isMoving, intension } = movement;

      if (!isMoving || (vector.x === 0 && vector.y === 0)) {
        vector.multiplyNumber(0);
        return;
      }

      const transform = actor.getComponent(Transform);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      vector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / vector.magnitude) * intension
      );

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;

      const viewDirection = actor.getComponent(ViewDirection);

      viewDirection.x = vector.x;
      viewDirection.y = vector.y;

      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
