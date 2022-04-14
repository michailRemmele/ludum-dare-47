import { ActiveEffects } from '../../components/activeEffects';

import effectApplicators from './effectApplicators';
import { ACTIVE_EFFECTS_COMPONENT_NAME, EFFECT_COMPONENT_NAME } from './consts';

const ADD_EFFECT_MSG = 'ADD_EFFECT';
const REMOVE_EFFECT_MSG = 'REMOVE_EFFECT';
const KILL_MSG = 'KILL';

export class EffectsSystem {
  constructor(options) {
    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
    this._actions = options.effects;
    this.messageBus = options.messageBus;

    this._applicatorsMap = {};
  }

  systemDidMount() {
    this._gameObjectObserver.subscribe('onremove', this._handleGameObjectRemove);
  }

  systemWillUnmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleGameObjectRemove);
  }

  _handleGameObjectRemove = (gameObject) => {
    const gameObjectId = gameObject.getId();

    const applicatorsNames = Object.keys(this._applicatorsMap[gameObjectId] || {});
    applicatorsNames.forEach((name) => {
      this._applicatorsMap[gameObjectId][name] = null;
    });
  };

  _killEffect(effect) {
    this.messageBus.send({
      type: KILL_MSG,
      id: effect.getId(),
      gameObject: effect,
    });
  }

  _cancelEffect(name, gameObject) {
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

      this._killEffect(activeEffects.map[activeEffectName]);

      activeEffects.map[activeEffectName] = null;

      return false;
    });
  }

  _addEffect(name, gameObject, options) {
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
      new EffectAction(gameObject, this.messageBus, { ...constOptions, ...options }),
      effect,
      this.messageBus
    );

    this._applicatorsMap[gameObjectId] = this._applicatorsMap[gameObjectId] || {};
    this._applicatorsMap[gameObjectId][name] = effectApplicator;
  }

  _processNewEffects() {
    const newEffects = this.messageBus.get(ADD_EFFECT_MSG) || [];
    newEffects.forEach((message) => {
      const {
        name,
        options,
        gameObject,
      } = message;

      this._cancelEffect(name, gameObject);
      this._addEffect(name, gameObject, options);
    });
  }

  _processEffectsCancellation() {
    const cancelledEffects = this.messageBus.get(REMOVE_EFFECT_MSG) || [];
    cancelledEffects.forEach((message) => {
      const { name, gameObject } = message;
      this._cancelEffect(name, gameObject);
    });
  }

  update(options) {
    const deltaTime = options.deltaTime;

    this._gameObjectObserver.fireEvents();

    this._processNewEffects();
    this._processEffectsCancellation();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const activeEffects = gameObject.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);

      activeEffects.list = activeEffects.list.filter((name) => {
        const effectApplicator = this._applicatorsMap[gameObjectId][name];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[name]);

          activeEffects.map[name] = null;
          this._applicatorsMap[gameObjectId][name] = null;

          return false;
        }

        return true;
      });
    });
  }
}
