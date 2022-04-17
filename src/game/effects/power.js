import { Effect } from '../systems/effects-system';

const WEAPON_COMPONENT_NAME = 'weapon';

class Heal extends Effect {
  constructor(entity, _messageBus, options) {
    super();

    this._entity = entity;
    this._damage = options.damage;
    this._range = options.range;
  }

  apply() {
    const weapon = this._entity.getComponent(WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.properties.damage += this._damage;
    weapon.properties.range += this._range;
  }

  onCancel() {
    const weapon = this._entity.getComponent(WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.properties.damage -= this._damage;
    weapon.properties.range -= this._range;
  }
}

export default Heal;
