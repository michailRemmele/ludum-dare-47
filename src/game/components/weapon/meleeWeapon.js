class MeleeWeapon {
  constructor(config) {
    this._damage = config.damage;
    this._range = config.range;
  }

  set damage(damage) {
    this._damage = damage;
  }

  get damage() {
    return this._damage;
  }

  set range(range) {
    this._range = range;
  }

  get range() {
    return this._range;
  }

  clone() {
    return new MeleeWeapon({
      damage: this.damage,
      range: this.range,
    });
  }
}

export default MeleeWeapon;
