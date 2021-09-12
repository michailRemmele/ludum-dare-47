import EffectApplicator from './effectApplicator';

import { EFFECT_COMPONENT_NAME } from '../consts';

class PeriodicalEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isFinished = false;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const { applicatorOptions } = this._effect.getComponent(EFFECT_COMPONENT_NAME);

    applicatorOptions.cooldown -= deltaTime;

    while (applicatorOptions.cooldown <= 0) {
      this._action.apply();
      this._handleApply();
      applicatorOptions.cooldown += applicatorOptions.frequency;
    }

    if (applicatorOptions.duration) {
      applicatorOptions.duration -= deltaTime;
      if (applicatorOptions.duration <= 0) {
        this._isFinished = true;
      }
    }
  }

  cancel() {
    this._handleCancel();
  }

  isFinished() {
    return this._isFinished;
  }
}

export default PeriodicalEffectApplicator;
