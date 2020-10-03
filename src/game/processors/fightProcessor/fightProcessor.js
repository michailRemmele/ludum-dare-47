import { Processor, VectorOps, MathOps } from '@flyer-engine/core';

const DAMAGE_MSG = 'DAMAGE';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const HIT_MSG = 'HIT';
const ADD_EFFECT_MSG = 'ADD_EFFECT';
const ADD_FORCE_MSG = 'ADD_FORCE';

const PUSH_POWER = 'pushPower';

const HIT_PREFAB_NAME = 'hit';

const TRANSFORM_COMPONENT_NAME = 'transform';
const MELEE_WEAPON_COMPONENT_NAME = 'meleeWeapon';
const COLLIDER_CONTAINER_COMPONENT_NAME = 'colliderContainer';
const HEALTH_COMPONENT_NAME = 'health';
const HITBOX_COMPONENT_NAME = 'hitBox';

const ACCELERATION_DURATION = 10;
const FETTER_DURATION = 250;
const PUSH_FORCE = 35000;

const HIT_LIFETIME = 500;

const LIFETIME_EFFECT = {
  name: 'lifetime',
  effect: 'damage',
  effectType: 'delayed',
  applicatorOptions: {
    timer: 800,
  },
};

const FETTER_EFFECT = {
  name: 'weaponFetter',
  effect: 'fetter',
  effectType: 'timeLimited',
};

class FightProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;

    this._activeHits = [];
  }

  _pushTarget(target, directionVector, messageBus) {
    messageBus.send({
      type: ADD_FORCE_MSG,
      name: PUSH_POWER,
      value: directionVector,
      duration: ACCELERATION_DURATION,
      gameObject: target,
      id: target.getId(),
    });
  }

  _processActiveHits(messageBus) {
    this._activeHits = this._activeHits.filter((entry) => {
      const { player, hit, directionVector, damage } = entry;
      const hitId = hit.getId();

      const collisionMessages = messageBus.getById(COLLISION_ENTER_MSG, hitId) || [];
      return collisionMessages.forEach((message) => {
        const { gameObject2 } = message;

        const hitBox = gameObject2.getComponent(HITBOX_COMPONENT_NAME);
        const target = gameObject2.getParent();

        if (!hitBox || !target) {
          return;
        }

        const targetId = target.getId();

        if (player.getId() === targetId || hitId === targetId) {
          return;
        }

        messageBus.send({
          type: DAMAGE_MSG,
          id: targetId,
          gameObject: target,
          value: damage,
        });
        messageBus.send({
          type: ADD_EFFECT_MSG,
          id: targetId,
          gameObject: target,
          ...FETTER_EFFECT,
          applicatorOptions: {
            duration: FETTER_DURATION,
          },
        });

        this._pushTarget(target, directionVector.clone(), messageBus);
      });
    });
  }

  _processWeaponsCooldown(deltaTime) {
    this._gameObjectObserver.forEach((gameObject) => {
      const weapon = gameObject.getComponent(MELEE_WEAPON_COMPONENT_NAME);

      if (weapon.cooldownRemaining > 0) {
        weapon.cooldownRemaining -= deltaTime;
      }
    });
  }

  _hit(player, targetX, targetY, messageBus) {
    const { offsetX, offsetY } = player.getComponent(TRANSFORM_COMPONENT_NAME);
    const weapon = player.getComponent(MELEE_WEAPON_COMPONENT_NAME);

    if (weapon.cooldownRemaining > 0) {
      messageBus.deleteById(HIT_MSG, player.getId());
      return;
    }

    const hit = this._gameObjectSpawner.spawn(HIT_PREFAB_NAME);
    const hitTransform = hit.getComponent(TRANSFORM_COMPONENT_NAME);
    const hitCollider = hit.getComponent(COLLIDER_CONTAINER_COMPONENT_NAME).collider;
    const hitHealth = hit.getComponent(HEALTH_COMPONENT_NAME);

    hitCollider.radius = weapon.range / 2;

    const angle = MathOps.getAngleBetweenTwoPoints(targetX, offsetX, targetY, offsetY);
    const hitCenter = MathOps.getLinePoint(
      MathOps.radToDeg(angle) + 180, offsetX, offsetY, hitCollider.radius
    );

    hitTransform.offsetX = hitCenter.x;
    hitTransform.offsetY = hitCenter.y;

    const directionVector = VectorOps.getVectorByAngle(angle);
    directionVector.multiplyNumber(PUSH_FORCE);

    messageBus.send({
      type: ADD_EFFECT_MSG,
      id: hit.getId(),
      gameObject: hit,
      ...LIFETIME_EFFECT,
      applicatorOptions: {
        timer: HIT_LIFETIME,
      },
      effectOptions: {
        value: hitHealth.points,
      },
    });

    this._activeHits.push({
      player,
      hit,
      directionVector,
      damage: weapon.damage,
    });

    weapon.cooldownRemaining = weapon.cooldown;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._processActiveHits(messageBus);
    this._processWeaponsCooldown(deltaTime);

    const messages = messageBus.get(HIT_MSG) || [];
    messages.forEach((message) => {
      const { gameObject, x, y } = message;
      this._hit(gameObject, x, y, messageBus);
    });
  }
}

export default FightProcessor;
