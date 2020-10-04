import Effect from './effect';

const MELEE_WEAPON_COMPONENT_NAME = 'meleeWeapon';

class Heal extends Effect {
  constructor(gameObject, _messageBus, options) {
    super();

    this._gameObject = gameObject;
    this._damage = options.damage;
    this._range = options.range;
  }

  apply() {
    const weapon = this._gameObject.getComponent(MELEE_WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.damage += this._damage;
    weapon.range += this._range;
  }

  onCancel() {
    const weapon = this._gameObject.getComponent(MELEE_WEAPON_COMPONENT_NAME);

    if (!weapon) {
      return;
    }

    weapon.damage -= this._damage;
    weapon.range -= this._range;
  }
}

export default Heal;
