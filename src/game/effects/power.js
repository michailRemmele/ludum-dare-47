import { Effect } from '../systems/effects-system';
import { Weapon } from '../components';

class Heal extends Effect {
  constructor(actor, options) {
    super();

    this._actor = actor;
    this._damage = options.damage;
    this._range = options.range;
  }

  apply() {
    const weapon = this._actor.getComponent(Weapon);

    if (!weapon) {
      return;
    }

    weapon.properties.damage += this._damage;
    weapon.properties.range += this._range;
  }

  onCancel() {
    const weapon = this._actor.getComponent(Weapon);

    if (!weapon) {
      return;
    }

    weapon.properties.damage -= this._damage;
    weapon.properties.range -= this._range;
  }
}

export default Heal;
