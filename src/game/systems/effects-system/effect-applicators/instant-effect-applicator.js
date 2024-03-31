import { EffectApplicator } from './effect-applicator';

export class InstantEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isFinished = false;
  }

  update() {
    if (this._isFinished) {
      return;
    }

    this._action.apply();
    this._handleApply();
    this._isFinished = true;
  }

  cancel() {
    this._handleCancel();
  }

  isFinished() {
    return this._isFinished;
  }
}
