import EffectApplicator from './effectApplicator';

import { EFFECT_COMPONENT_NAME } from '../consts';

class DelayedEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isFinished = false;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const { applicatorOptions } = this._effect.getComponent(EFFECT_COMPONENT_NAME);

    applicatorOptions.timer -= deltaTime;

    if (applicatorOptions.timer <= 0) {
      this._action.apply();
      this._handleApply();
      this._isFinished = true;
    }
  }

  cancel() {
    this._handleCancel();
  }

  isFinished() {
    return this._isFinished;
  }
}

export default DelayedEffectApplicator;
