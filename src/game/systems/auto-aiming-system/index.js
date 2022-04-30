import { MathOps } from 'remiz';

const ATTACK_MSG = 'ATTACK';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const KEYBOARD_CONTROL_COMPONENT_NAME = 'keyboardControl';
const MOUSE_CONTROL_COMPONENT_NAME = 'mouseControl';
const TRANSFORM_COMPONENT_NAME = 'transform';
const VIEW_DIRECTION_COMPONENT_NAME = 'viewDirection';
const AIM_RADIUS_COMPONENT_NAME = 'aimRadius';
const HITBOX_COMPONENT_NAME = 'hitBox';

export class AutoAimingSystem {
  constructor(options) {
    this._entityObserver = options.createEntityObserver({
      components: [
        KEYBOARD_CONTROL_COMPONENT_NAME,
        MOUSE_CONTROL_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
  }

  update() {
    this._entityObserver.forEach((entity) => {
      const { offsetX, offsetY } = entity.getComponent(TRANSFORM_COMPONENT_NAME);
      const viewDirection = entity.getComponent(VIEW_DIRECTION_COMPONENT_NAME);

      const attackMessages = this.messageBus.getById(ATTACK_MSG, entity.getId()) || [];

      attackMessages.forEach((attackMessage) => {
        const { x, y } = attackMessage;

        if (x !== void 0 && y !== void 0) {
          return;
        }

        attackMessage.x = offsetX + viewDirection.x;
        attackMessage.y = offsetY + viewDirection.y;

        const aimRadius = entity.getChildren().find(
          (child) => child.getComponent(AIM_RADIUS_COMPONENT_NAME)
        );

        if (!aimRadius) {
          return;
        }

        const collisionMessages =
          this.messageBus.getById(COLLISION_STAY_MSG, aimRadius.getId()) || [];

        let nearestTargetDistance;

        collisionMessages.forEach((collisionMessage) => {
          const { entity2 } = collisionMessage;

          const hitBox = entity2.getComponent(HITBOX_COMPONENT_NAME);
          const targetParent = entity2.parent;

          if (!hitBox || entity.getId() === targetParent.getId()) {
            return;
          }

          const {
            offsetX: targetX,
            offsetY: targetY,
          } = entity2.getComponent(TRANSFORM_COMPONENT_NAME);

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
