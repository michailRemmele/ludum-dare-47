import { Processor, MathOps } from '@flyer-engine/core';

const ATTACK_MSG = 'ATTACK';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const TRANSFORM_COMPONENT_NAME = 'transform';
const VIEW_DIRECTION_COMPONENT_NAME = 'viewDirection';
const AIM_RADIUS_COMPONENT_NAME = 'aimRadius';
const HITBOX_COMPONENT_NAME = 'hitBox';

class AutoAimingProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
  }

  process(options) {
    const { messageBus } = options;

    this._gameObjectObserver.forEach((gameObject) => {
      const { offsetX, offsetY } = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const viewDirection = gameObject.getComponent(VIEW_DIRECTION_COMPONENT_NAME);

      const attackMessages = messageBus.getById(ATTACK_MSG, gameObject.getId()) || [];

      attackMessages.forEach((attackMessage) => {
        const { x, y } = attackMessage;

        if (x !== void 0 && y !== void 0) {
          return;
        }

        attackMessage.x = offsetX + viewDirection.x;
        attackMessage.y = offsetY + viewDirection.y;

        const aimRadius = gameObject.getChildren().find(
          (child) => child.getComponent(AIM_RADIUS_COMPONENT_NAME)
        );

        if (!aimRadius) {
          return;
        }

        const collisionMessages = messageBus.getById(COLLISION_STAY_MSG, aimRadius.getId()) || [];

        let nearestTargetDistance;

        collisionMessages.forEach((collisionMessage) => {
          const { gameObject2 } = collisionMessage;

          const hitBox = gameObject2.getComponent(HITBOX_COMPONENT_NAME);
          const targetParent = gameObject2.parent;

          if (!hitBox || gameObject.getId() === targetParent.getId()) {
            return;
          }

          const {
            offsetX: targetX,
            offsetY: targetY,
          } = gameObject2.getComponent(TRANSFORM_COMPONENT_NAME);

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

export default AutoAimingProcessor;
