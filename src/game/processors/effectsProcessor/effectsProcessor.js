import { ActiveEffects } from '../../components/activeEffects';

import effectApplicators from './effectApplicators';
import { ACTIVE_EFFECTS_COMPONENT_NAME, EFFECT_COMPONENT_NAME } from './consts';

const ADD_EFFECT_MSG = 'ADD_EFFECT';
const REMOVE_EFFECT_MSG = 'REMOVE_EFFECT';
const KILL_MSG = 'KILL';

export class EffectsProcessor {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
    this._actions = options.effects;

    this._applicatorsMap = {};
  }

  _killEffect(effect, messageBus) {
    messageBus.send({
      type: KILL_MSG,
      id: effect.getId(),
      gameObject: effect,
    });
  }

  _cancelEffect(name, gameObject, messageBus) {
    const gameObjectId = gameObject.getId();

    if (!this._applicatorsMap[gameObjectId] || !this._applicatorsMap[gameObjectId][name]) {
      return;
    }

    this._applicatorsMap[gameObjectId][name].cancel();
    this._applicatorsMap[gameObjectId][name] = null;

    const activeEffects = gameObject.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);

    activeEffects.list = activeEffects.list.filter((activeEffectName) => {
      if (name !== activeEffectName) {
        return true;
      }

      this._killEffect(activeEffects.map[activeEffectName], messageBus);

      activeEffects.map[activeEffectName] = null;

      return false;
    });
  }

  _addEffect(name, gameObject, options, messageBus) {
    const gameObjectId = gameObject.getId();

    const effect = this._gameObjectSpawner.spawn(name);
    gameObject.appendChild(effect);

    const {
      action,
      type,
      options: constOptions,
    } = effect.getComponent(EFFECT_COMPONENT_NAME);

    if (!gameObject.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME)) {
      gameObject.setComponent(ACTIVE_EFFECTS_COMPONENT_NAME, new ActiveEffects());
    }

    const activeEffects = gameObject.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);
    activeEffects.list.push(name);
    activeEffects.map[name] = effect;

    const EffectAction = this._actions[action];
    const EffectApplicator = effectApplicators[type];

    const effectApplicator = new EffectApplicator(
      new EffectAction(gameObject, messageBus, { ...constOptions, ...options }),
      effect,
      messageBus
    );

    this._applicatorsMap[gameObjectId] = this._applicatorsMap[gameObjectId] || {};
    this._applicatorsMap[gameObjectId][name] = effectApplicator;
  }

  _processNewEffects(messageBus) {
    const newEffects = messageBus.get(ADD_EFFECT_MSG) || [];
    newEffects.forEach((message) => {
      const {
        name,
        options,
        gameObject,
      } = message;

      this._cancelEffect(name, gameObject, messageBus);
      this._addEffect(name, gameObject, options, messageBus);
    });
  }

  _processEffectsCancellation(messageBus) {
    const cancelledEffects = messageBus.get(REMOVE_EFFECT_MSG) || [];
    cancelledEffects.forEach((message) => {
      const { name, gameObject } = message;
      this._cancelEffect(name, gameObject, messageBus);
    });
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const applicatorsNames = Object.keys(this._applicatorsMap[gameObjectId] || {});
      applicatorsNames.forEach((name) => {
        this._applicatorsMap[gameObjectId][name] = null;
      });
    });
  }

  process(options) {
    const messageBus = options.messageBus;
    const deltaTime = options.deltaTime;

    this._processRemovedGameObjects();
    this._processNewEffects(messageBus);
    this._processEffectsCancellation(messageBus);

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const activeEffects = gameObject.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);

      activeEffects.list = activeEffects.list.filter((name) => {
        const effectApplicator = this._applicatorsMap[gameObjectId][name];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[name], messageBus);

          activeEffects.map[name] = null;
          this._applicatorsMap[gameObjectId][name] = null;

          return false;
        }

        return true;
      });
    });
  }
}
