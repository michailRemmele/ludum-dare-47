import { EventType } from '../../../../events';

export class EffectApplicator {
  constructor(action, effect) {
    this._action = action;
    this._effect = effect;
  }

  _handleCancel() {
    this._effect.dispatchEvent(EventType.CancelEffect);
  }

  _handleApply() {
    this._effect.dispatchEvent(EventType.ApplyEffect);
  }

  update() {
    throw new Error('You should override this function');
  }

  isFinished() {
    throw new Error('You should override this function');
  }

  cancel() {}
}
