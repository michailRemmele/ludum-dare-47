import {
  ActorCollection,
  System,
  RemoveActor,
} from 'remiz';

import { EventType } from '../../../events';
import { ActiveEffects, Effect } from '../../components';

import { effectApplicators } from './effect-applicators';

export class EffectsSystem extends System {
  constructor(options) {
    super();

    const {
      actorSpawner,
      resources = {},
      scene,
    } = options;

    this.scene = scene;
    this.actorCollection = new ActorCollection(scene);
    this.activeEffectsCollection = new ActorCollection(scene, {
      components: [ ActiveEffects ],
    });
    this._actorSpawner = actorSpawner;
    this._actions = resources;

    this._applicatorsMap = {};
  }

  mount() {
    this.scene.addEventListener(EventType.AddEffect, this._handleAddEffect);
    this.scene.addEventListener(EventType.RemoveEffect, this._handleRemoveEffect);

    this.activeEffectsCollection.addEventListener(RemoveActor, this._handleRemoveAffected);
  }

  unmount() {
    this.scene.removeEventListener(EventType.AddEffect, this._handleAddEffect);
    this.scene.removeEventListener(EventType.RemoveEffect, this._handleRemoveEffect);

    this.activeEffectsCollection.removeEventListener(RemoveActor, this._handleRemoveAffected);
  }

  _handleRemoveAffected = (event) => {
    const { actor } = event;

    const applicatorsNames = Object.keys(this._applicatorsMap[actor.id] || {});
    applicatorsNames.forEach((name) => {
      this._applicatorsMap[actor.id][name] = null;
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

  _cancelEffect(effectId, actor) {
    if (!this._applicatorsMap[actor.id] || !this._applicatorsMap[actor.id][effectId]) {
      return;
    }

    this._applicatorsMap[actor.id][effectId].cancel();
    this._applicatorsMap[actor.id][effectId] = null;

    const activeEffects = actor.getComponent(ActiveEffects);

    activeEffects.list = activeEffects.list.filter((activeEffectId) => {
      if (effectId !== activeEffectId) {
        return true;
      }

      this._killEffect(activeEffects.map[activeEffectId]);

      activeEffects.map[activeEffectId] = null;

      return false;
    });
  }

  _addEffect(effectId, actor, options) {
    const effect = this._actorSpawner.spawn(effectId);
    actor.appendChild(effect);

    const {
      action,
      type,
      options: constOptions,
    } = effect.getComponent(Effect);

    if (!actor.getComponent(ActiveEffects)) {
      actor.setComponent(new ActiveEffects());
    }

    const activeEffects = actor.getComponent(ActiveEffects);
    activeEffects.list.push(effectId);
    activeEffects.map[effectId] = effect;

    const EffectAction = this._actions[action];
    const EffectApplicator = effectApplicators[type];

    const effectApplicator = new EffectApplicator(
      new EffectAction(actor, { ...constOptions, ...options }),
      effect,
    );

    this._applicatorsMap[actor.id] ??= {};
    this._applicatorsMap[actor.id][effectId] = effectApplicator;
  }

  update(options) {
    const deltaTime = options.deltaTime;

    this.activeEffectsCollection.forEach((actor) => {
      const activeEffects = actor.getComponent(ActiveEffects);

      activeEffects.list = activeEffects.list.filter((effectId) => {
        const effectApplicator = this._applicatorsMap[actor.id][effectId];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[effectId]);

          activeEffects.map[effectId] = null;
          this._applicatorsMap[actor.id][effectId] = null;

          return false;
        }

        return true;
      });
    });
  }
}

EffectsSystem.systemName = 'EffectsSystem';
