import { Processor } from '@flyer-engine/core';

import effectApplicators from './effectApplicators';

const ADD_EFFECT_MSG = 'ADD_EFFECT';
const REMOVE_EFFECT_MSG = 'REMOVE_EFFECT';

const EFFECT_COMPONENT_NAME = 'effect';

export class EffectsProcessor extends Processor {
  constructor(options) {
    super();

    this._gameObjectObserver = options.gameObjectObserver;
    this._gameObjectSpawner = options.gameObjectSpawner;
    this._effects = options.effects;

    this._activeEffectsMap = {};
    this._activeEffects = [];
  }

  _removeEffect(name, gameObjectId) {
    if (!this._activeEffectsMap[gameObjectId] || !this._activeEffectsMap[gameObjectId][name]) {
      return;
    }

    this._activeEffectsMap[gameObjectId][name].cancel();
    this._activeEffectsMap[gameObjectId][name] = null;

    this._activeEffects = this._activeEffects.filter((entry) => {
      return entry.name !== name || entry.gameObjectId !== gameObjectId;
    });
  }

  _processNewEffects(messageBus) {
    const newEffects = messageBus.get(ADD_EFFECT_MSG) || [];
    newEffects.forEach((message) => {
      const {
        name,
        options,
        gameObject,
      } = message;

      const effectGameObject = this._gameObjectSpawner.spawn(name);
      const {
        name: effectName,
        type,
        applicatorOptions,
        options: constOptions,
      } = effectGameObject.getComponent(EFFECT_COMPONENT_NAME);

      const Effect = this._effects[effectName];

      const effect = new Effect(gameObject, messageBus, { ...constOptions, ...options });
      const effectApplicator = new effectApplicators[type](effect, applicatorOptions);

      const gameObjectId = gameObject.getId();

      this._activeEffectsMap[gameObjectId] = this._activeEffectsMap[gameObjectId] || {};

      this._removeEffect(name, gameObjectId);

      this._activeEffectsMap[gameObjectId][name] = effectApplicator;
      this._activeEffects.push({
        name: name,
        gameObjectId: gameObjectId,
        effectApplicator: effectApplicator,
      });
    });
  }

  _processEffectsCancellation(messageBus) {
    const cancelledEffects = messageBus.get(REMOVE_EFFECT_MSG) || [];
    cancelledEffects.forEach((message) => {
      const { name, gameObject } = message;
      this._removeEffect(name, gameObject.getId());
    });
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const activeEffectNames = Object.keys(this._activeEffectsMap[gameObjectId] || {});
      activeEffectNames.forEach((name) => {
        this._removeEffect(name, gameObjectId);
      });
    });
  }

  process(options) {
    const messageBus = options.messageBus;
    const deltaTime = options.deltaTime;

    this._processRemovedGameObjects();
    this._processNewEffects(messageBus);
    this._processEffectsCancellation(messageBus);

    this._activeEffects = this._activeEffects.filter((entry) => {
      const { name, gameObjectId, effectApplicator } = entry;

      effectApplicator.update(deltaTime);

      if (effectApplicator.isFinished()) {
        this._activeEffectsMap[gameObjectId][name].cancel();
        this._activeEffectsMap[gameObjectId][name] = null;

        return false;
      }

      return true;
    });
  }
}
