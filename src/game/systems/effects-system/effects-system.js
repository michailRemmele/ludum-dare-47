import { System } from 'remiz';

import { ActiveEffects, Effect } from '../../components';

import { effectApplicators } from './effect-applicators';

const ADD_EFFECT_MSG = 'ADD_EFFECT';
const REMOVE_EFFECT_MSG = 'REMOVE_EFFECT';
const KILL_MSG = 'KILL';

export class EffectsSystem extends System {
  constructor(options) {
    super();

    this._gameObjectObserver = options.createGameObjectObserver({
      components: [ ActiveEffects ],
    });
    this._gameObjectSpawner = options.gameObjectSpawner;
    this._actions = options.effects;
    this.messageBus = options.messageBus;
    this.helpers = options.helpers;

    this._applicatorsMap = {};
  }

  mount() {
    this._gameObjectObserver.subscribe('onremove', this._handleEntitiyRemove);
  }

  unmount() {
    this._gameObjectObserver.unsubscribe('onremove', this._handleEntitiyRemove);
  }

  async load() {
    const { effects } = await this.helpers.loadEffects();

    this._actions = effects;
  }

  _handleEntitiyRemove = (gameObject) => {
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

  _cancelEffect(effectId, gameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._applicatorsMap[gameObjectId] || !this._applicatorsMap[gameObjectId][effectId]) {
      return;
    }

    this._applicatorsMap[gameObjectId][effectId].cancel();
    this._applicatorsMap[gameObjectId][effectId] = null;

    const activeEffects = gameObject.getComponent(ActiveEffects);

    activeEffects.list = activeEffects.list.filter((activeEffectId) => {
      if (effectId !== activeEffectId) {
        return true;
      }

      this._killEffect(activeEffects.map[activeEffectId]);

      activeEffects.map[activeEffectId] = null;

      return false;
    });
  }

  _addEffect(effectId, gameObject, options) {
    const gameObjectId = gameObject.getId();

    const effect = this._gameObjectSpawner.spawn(effectId);
    gameObject.appendChild(effect);

    const {
      action,
      type,
      options: constOptions,
    } = effect.getComponent(Effect);

    if (!gameObject.getComponent(ActiveEffects)) {
      gameObject.setComponent(new ActiveEffects());
    }

    const activeEffects = gameObject.getComponent(ActiveEffects);
    activeEffects.list.push(effectId);
    activeEffects.map[effectId] = effect;

    const EffectAction = this._actions[action];
    const EffectApplicator = effectApplicators[type];

    const effectApplicator = new EffectApplicator(
      new EffectAction(gameObject, this.messageBus, { ...constOptions, ...options }),
      effect,
      this.messageBus
    );

    this._applicatorsMap[gameObjectId] = this._applicatorsMap[gameObjectId] || {};
    this._applicatorsMap[gameObjectId][effectId] = effectApplicator;
  }

  _processNewEffects() {
    const newEffects = this.messageBus.get(ADD_EFFECT_MSG) || [];
    newEffects.forEach((message) => {
      const {
        effectId,
        options,
        gameObject,
      } = message;

      this._cancelEffect(effectId, gameObject);
      this._addEffect(effectId, gameObject, options);
    });
  }

  _processEffectsCancellation() {
    const cancelledEffects = this.messageBus.get(REMOVE_EFFECT_MSG) || [];
    cancelledEffects.forEach((message) => {
      const { effectId, gameObject } = message;
      this._cancelEffect(effectId, gameObject);
    });
  }

  update(options) {
    const deltaTime = options.deltaTime;

    this._gameObjectObserver.fireEvents();

    this._processNewEffects();
    this._processEffectsCancellation();

    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const activeEffects = gameObject.getComponent(ActiveEffects);

      activeEffects.list = activeEffects.list.filter((effectId) => {
        const effectApplicator = this._applicatorsMap[gameObjectId][effectId];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[effectId]);

          activeEffects.map[effectId] = null;
          this._applicatorsMap[gameObjectId][effectId] = null;

          return false;
        }

        return true;
      });
    });
  }
}

EffectsSystem.systemName = 'EffectsSystem';
