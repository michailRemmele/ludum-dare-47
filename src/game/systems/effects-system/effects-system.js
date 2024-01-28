import {
  GameObject,
  GameObjectObserver,
  System,
  AddGameObject,
  RemoveGameObject,
} from 'remiz';

import { EventType } from '../../../events';
import { ActiveEffects, Effect } from '../../components';

import { effectApplicators } from './effect-applicators';

export class EffectsSystem extends System {
  constructor(options) {
    super();

    const {
      gameObjectSpawner,
      resources = {},
      scene,
    } = options;

    this.gameObjectObserver = new GameObjectObserver(scene);
    this.activeEffectsObserver = new GameObjectObserver(scene, {
      components: [ ActiveEffects ],
    });
    this._gameObjectSpawner = gameObjectSpawner;
    this._actions = resources;

    this._applicatorsMap = {};
  }

  mount() {
    this.gameObjectObserver.forEach(this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this._handleRemoveGameObject);

    this.activeEffectsObserver.addEventListener(RemoveGameObject, this._handleRemoveAffected);
  }

  unmount() {
    this.gameObjectObserver.forEach(this._handleRemoveGameObject);
    this.gameObjectObserver.removeEventListener(AddGameObject, this._handleAddGameObject);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this._handleRemoveGameObject);

    this.activeEffectsObserver.removeEventListener(RemoveGameObject, this._handleRemoveAffected);
  }

  _handleAddGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.addEventListener(EventType.AddEffect, this._handleAddEffect);
    gameObject.addEventListener(EventType.RemoveEffect, this._handleRemoveEffect);
  };

  _handleRemoveGameObject = (value) => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    gameObject.removeEventListener(EventType.AddEffect, this._handleAddEffect);
    gameObject.removeEventListener(EventType.RemoveEffect, this._handleRemoveEffect);
  };

  _handleRemoveAffected = (event) => {
    const { gameObject } = event;

    const applicatorsNames = Object.keys(this._applicatorsMap[gameObject.id] || {});
    applicatorsNames.forEach((name) => {
      this._applicatorsMap[gameObject.id][name] = null;
    });
  };

  _handleAddEffect = (event) => {
    const { effectId, options, target } = event;
    this._cancelEffect(effectId, target);
    this._addEffect(effectId, target, options);
  };

  _handleRemoveEffect = (event) => {
    const { effectId, target } = event;
    this._cancelEffect(effectId, target);
  };

  _killEffect(effect) {
    effect.emit(EventType.Kill);
  }

  _cancelEffect(effectId, gameObject) {
    if (!this._applicatorsMap[gameObject.id] || !this._applicatorsMap[gameObject.id][effectId]) {
      return;
    }

    this._applicatorsMap[gameObject.id][effectId].cancel();
    this._applicatorsMap[gameObject.id][effectId] = null;

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
      new EffectAction(gameObject, { ...constOptions, ...options }),
      effect,
    );

    this._applicatorsMap[gameObject.id] ??= {};
    this._applicatorsMap[gameObject.id][effectId] = effectApplicator;
  }

  update(options) {
    const deltaTime = options.deltaTime;

    this.activeEffectsObserver.forEach((gameObject) => {
      const activeEffects = gameObject.getComponent(ActiveEffects);

      activeEffects.list = activeEffects.list.filter((effectId) => {
        const effectApplicator = this._applicatorsMap[gameObject.id][effectId];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[effectId]);

          activeEffects.map[effectId] = null;
          this._applicatorsMap[gameObject.id][effectId] = null;

          return false;
        }

        return true;
      });
    });
  }
}

EffectsSystem.systemName = 'EffectsSystem';
