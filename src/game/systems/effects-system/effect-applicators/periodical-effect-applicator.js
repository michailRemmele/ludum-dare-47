import { Effect } from '../../../components';

import { EffectApplicator } from './effect-applicator';

export class PeriodicalEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isFinished = false;
  }

  update(deltaTime) {
    if (this._isFinished) {
      return;
    }

    const { applicatorOptions } = this._effect.getComponent(Effect);

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
