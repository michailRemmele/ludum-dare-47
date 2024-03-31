export class MeleeWeapon {
  constructor(config) {
    this.damage = config.damage;
    this.range = config.range;
  }

  clone() {
    return new MeleeWeapon({
      damage: this.damage,
      range: this.range,
    });
  }
}
