import { Effect } from '../systems/effects-system';

const DAMAGE_MSG = 'DAMAGE';

class Damage extends Effect {
  constructor(entity, messageBus, options) {
    super();

    this._entity = entity;
    this._messageBus = messageBus;
    this._value = options.value;
  }

  apply() {
    this._messageBus.send({
      type: DAMAGE_MSG,
      id: this._entity.getId(),
      entity: this._entity,
      value: this._value,
    });
  }
}

export default Damage;
