import { EFFECT_ADD_MSG, EFFECT_APPLY_MSG, EFFECT_CANCEL_MSG } from './consts';

export class EffectApplicator {
  constructor(action, effect, messageBus) {
    this._action = action;
    this._effect = effect;
    this._messageBus = messageBus;

    this._messageBus.send({
      type: EFFECT_ADD_MSG,
      id: this._effect.getId(),
      gameObject: this._effect,
    });
  }

  _handleCancel() {
    this._messageBus.send({
      type: EFFECT_CANCEL_MSG,
      id: this._effect.getId(),
      gameObject: this._effect,
    });
  }

  _handleApply() {
    this._messageBus.send({
      type: EFFECT_APPLY_MSG,
      id: this._effect.getId(),
      gameObject: this._effect,
    });
  }

  update() {
    throw new Error('You should override this function');
  }

  isFinished() {
    throw new Error('You should override this function');
  }

  cancel() {}
}
