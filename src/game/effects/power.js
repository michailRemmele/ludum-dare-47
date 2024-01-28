import { Effect } from '../systems/effects-system';
import { Weapon } from '../components';

class Heal extends Effect {
  constructor(gameObject, options) {
    super();

    this._gameObject = gameObject;
    this._damage = options.damage;
    this._range = options.range;
  }

  apply() {
    const weapon = this._gameObject.getComponent(Weapon);

    if (!weapon) {
      return;
    }

    weapon.properties.damage += this._damage;
    weapon.properties.range += this._range;
  }

  onCancel() {
    const weapon = this._gameObject.getComponent(Weapon);

    if (!weapon) {
      return;
    }

    weapon.properties.damage -= this._damage;
    weapon.properties.range -= this._range;
  }
}

export default Heal;
