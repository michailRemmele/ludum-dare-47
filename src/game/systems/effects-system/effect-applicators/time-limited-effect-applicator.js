import { Effect } from '../../../components';

import { EffectApplicator } from './effect-applicator';

export class TimeLimitedEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isApplied = false;
    this._isFinished = false;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const { applicatorOptions } = this._effect.getComponent(Effect);

    applicatorOptions.duration -= deltaTime;

    if (applicatorOptions.duration <= 0) {
      this._isFinished = true;
      return;
    }

    if (this._isApplied) {
      return;
    }

    this._action.apply();
    this._handleApply();
    this._isApplied = true;
  }

  cancel() {
    if (!this._isApplied) {
      return;
    }

    this._action.onCancel();
    this._handleCancel();
  }

  isFinished() {
    return this._isFinished;
  }
}
