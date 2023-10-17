import { EffectApplicator } from './effect-applicator';

export class ContinuousEffectApplicator extends EffectApplicator {
  constructor(...args) {
    super(...args);

    this._isApplied = false;
  }

  update() {
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
    return false;
  }
}
