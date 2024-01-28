import { EventType } from '../../events';
import { Effect } from '../systems/effects-system';

class Damage extends Effect {
  constructor(gameObject, options) {
    super();

    this._gameObject = gameObject;
    this._value = options.value;
  }

  apply() {
    this._gameObject.emit(EventType.Damage, { value: this._value });
  }
}

export default Damage;
