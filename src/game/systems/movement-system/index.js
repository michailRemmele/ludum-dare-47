import {
  GameObject,
  GameObjectObserver,
  MathOps,
  VectorOps,
  System,
  Transform,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { EventType } from '../../../events';
import { Movement, ViewDirection } from '../../components';

const SPEED_DIVIDER = 0.4;
const MIN_SPEED = 0.5;
const MAX_SPEED = 1;

export class MovementSystem extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [
        Movement,
        Transform,
      ],
    });
  }

  mount() {
    this.gameObjectObserver.forEach(this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  unmount() {
    this.gameObjectObserver.forEach(this._handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this._handleRemoveGameObject);
  }

  _handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(EventType.Movement, this._handleMovement);
  };

  _handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(EventType.Movement, this._handleMovement);
  };

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

    this.gameObjectObserver.forEach((gameObject) => {
      const movement = gameObject.getComponent(Movement);
      const { vector, speed, penalty, isMoving, intension } = movement;

      if (!isMoving || (vector.x === 0 && vector.y === 0)) {
        vector.multiplyNumber(0);
        return;
      }

      const transform = gameObject.getComponent(Transform);
      const resultingSpeed = penalty < speed ? speed - penalty : 0;

      vector.multiplyNumber(
        resultingSpeed * deltaTimeInSeconds * (1 / vector.magnitude) * intension
      );

      transform.offsetX = transform.offsetX + vector.x;
      transform.offsetY = transform.offsetY + vector.y;

      const viewDirection = gameObject.getComponent(ViewDirection);

      viewDirection.x = vector.x;
      viewDirection.y = vector.y;

      movement.isMoving = false;
    });
  }
}

MovementSystem.systemName = 'MovementSystem';
