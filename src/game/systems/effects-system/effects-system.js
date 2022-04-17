import { ActiveEffects } from '../../components/activeEffects';

import effectApplicators from './effectApplicators';
import { ACTIVE_EFFECTS_COMPONENT_NAME, EFFECT_COMPONENT_NAME } from './consts';

const ADD_EFFECT_MSG = 'ADD_EFFECT';
const REMOVE_EFFECT_MSG = 'REMOVE_EFFECT';
const KILL_MSG = 'KILL';

export class EffectsSystem {
  constructor(options) {
    this._entityObserver = options.entityObserver;
    this._entitySpawner = options.entitySpawner;
    this._actions = options.effects;
    this.messageBus = options.messageBus;

    this._applicatorsMap = {};
  }

  systemDidMount() {
    this._entityObserver.subscribe('onremove', this._handleEntitiyRemove);
  }

  systemWillUnmount() {
    this._entityObserver.unsubscribe('onremove', this._handleEntitiyRemove);
  }

  _handleEntitiyRemove = (entity) => {
    const entityId = entity.getId();

    const applicatorsNames = Object.keys(this._applicatorsMap[entityId] || {});
    applicatorsNames.forEach((name) => {
      this._applicatorsMap[entityId][name] = null;
    });
  };

  _killEffect(effect) {
    this.messageBus.send({
      type: KILL_MSG,
      id: effect.getId(),
      entity: effect,
    });
  }

  _cancelEffect(name, entity) {
    const entityId = entity.getId();

    if (!this._applicatorsMap[entityId] || !this._applicatorsMap[entityId][name]) {
      return;
    }

    this._applicatorsMap[entityId][name].cancel();
    this._applicatorsMap[entityId][name] = null;

    const activeEffects = entity.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);

    activeEffects.list = activeEffects.list.filter((activeEffectName) => {
      if (name !== activeEffectName) {
        return true;
      }

      this._killEffect(activeEffects.map[activeEffectName]);

      activeEffects.map[activeEffectName] = null;

      return false;
    });
  }

  _addEffect(name, entity, options) {
    const entityId = entity.getId();

    const effect = this._entitySpawner.spawn(name);
    entity.appendChild(effect);

    const {
      action,
      type,
      options: constOptions,
    } = effect.getComponent(EFFECT_COMPONENT_NAME);

    if (!entity.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME)) {
      entity.setComponent(ACTIVE_EFFECTS_COMPONENT_NAME, new ActiveEffects());
    }

    const activeEffects = entity.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);
    activeEffects.list.push(name);
    activeEffects.map[name] = effect;

    const EffectAction = this._actions[action];
    const EffectApplicator = effectApplicators[type];

    const effectApplicator = new EffectApplicator(
      new EffectAction(entity, this.messageBus, { ...constOptions, ...options }),
      effect,
      this.messageBus
    );

    this._applicatorsMap[entityId] = this._applicatorsMap[entityId] || {};
    this._applicatorsMap[entityId][name] = effectApplicator;
  }

  _processNewEffects() {
    const newEffects = this.messageBus.get(ADD_EFFECT_MSG) || [];
    newEffects.forEach((message) => {
      const {
        name,
        options,
        entity,
      } = message;

      this._cancelEffect(name, entity);
      this._addEffect(name, entity, options);
    });
  }

  _processEffectsCancellation() {
    const cancelledEffects = this.messageBus.get(REMOVE_EFFECT_MSG) || [];
    cancelledEffects.forEach((message) => {
      const { name, entity } = message;
      this._cancelEffect(name, entity);
    });
  }

  update(options) {
    const deltaTime = options.deltaTime;

    this._entityObserver.fireEvents();

    this._processNewEffects();
    this._processEffectsCancellation();

    this._entityObserver.forEach((entity) => {
      const entityId = entity.getId();
      const activeEffects = entity.getComponent(ACTIVE_EFFECTS_COMPONENT_NAME);

      activeEffects.list = activeEffects.list.filter((name) => {
        const effectApplicator = this._applicatorsMap[entityId][name];

        effectApplicator.update(deltaTime);

        if (effectApplicator.isFinished()) {
          effectApplicator.cancel();

          this._killEffect(activeEffects.map[name]);

          activeEffects.map[name] = null;
          this._applicatorsMap[entityId][name] = null;

          return false;
        }

        return true;
      });
    });
  }
}
