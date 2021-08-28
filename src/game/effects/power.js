import { Effect } from '../processors/effectsProcessor';

const WEAPON_COMPONENT_NAME = 'weapon';

class Heal extends Effect {
  constructor(gameObject, _messageBus, options) {
    super();

    this._gameObject = gameObject;
    this._damage = options.damage;
    this._range = options.range;
  }

  apply() {
    const weapon = this._gameObject.getComponent(WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.properties.damage += this._damage;
    weapon.properties.range += this._range;
  }

  onCancel() {
    const weapon = this._gameObject.getComponent(WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.properties.damage -= this._damage;
    weapon.properties.range -= this._range;
  }
}

export default Heal;
