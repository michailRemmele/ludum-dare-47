import { EventType } from '../../events';
import { Effect } from '../systems/effects-system';

class Damage extends Effect {
  constructor(actor, options) {
    super();

    this._actor = actor;
    this._value = options.value;
  }

  apply() {
    this._actor.dispatchEvent(EventType.Damage, { value: this._value });
  }
}

export default Damage;
