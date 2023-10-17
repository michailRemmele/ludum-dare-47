import {
  MathOps,
  System,
  KeyboardControl,
  MouseControl,
  Transform,
} from 'remiz';

import {
  ViewDirection,
  AimRadius,
  HitBox,
} from '../../components';

const ATTACK_MSG = 'ATTACK';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

export class AutoAimingSystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [
        KeyboardControl,
        MouseControl,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update() {
    this._gameObjectObserver.forEach((gameObject) => {
      const { offsetX, offsetY } = gameObject.getComponent(Transform);
      const viewDirection = gameObject.getComponent(ViewDirection);

      const attackMessages = this.messageBus.getById(ATTACK_MSG, gameObject.getId()) || [];

      attackMessages.forEach((attackMessage) => {
        const { x, y } = attackMessage;

        if (x !== void 0 && y !== void 0) {
          return;
        }

        attackMessage.x = offsetX + viewDirection.x;
        attackMessage.y = offsetY + viewDirection.y;

        const aimRadius = gameObject.getChildren().find(
          (child) => child.getComponent(AimRadius)
        );

        if (!aimRadius) {
          return;
        }

        const collisionMessages =
          this.messageBus.getById(COLLISION_STAY_MSG, aimRadius.getId()) || [];

        let nearestTargetDistance;

        collisionMessages.forEach((collisionMessage) => {
          const { gameObject2 } = collisionMessage;

          const hitBox = gameObject2.getComponent(HitBox);
          const targetParent = gameObject2.parent;

          if (!hitBox || gameObject.getId() === targetParent.getId()) {
            return;
          }

          const {
            offsetX: targetX,
            offsetY: targetY,
          } = gameObject2.getComponent(Transform);

          const distance = MathOps.getDistanceBetweenTwoPoints(offsetX, targetX, offsetY, targetY);

          if (nearestTargetDistance === void 0 || distance < nearestTargetDistance) {
            attackMessage.x = targetX;
            attackMessage.y = targetY;
            nearestTargetDistance = distance;
          }
        });
      });
    });
  }
}

AutoAimingSystem.systemName = 'AutoAimingSystem';
