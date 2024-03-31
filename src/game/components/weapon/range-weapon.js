export class RangeWeapon {
  constructor(config) {
    this.damage = config.damage;
    this.range = config.range;
    this.projectileSpeed = config.projectileSpeed;
    this.projectileModel = config.projectileModel;
    this.projectileRadius = config.projectileRadius;
  }

  clone() {
    return new RangeWeapon({
      damage: this.damage,
      range: this.range,
      projectileSpeed: this.projectileSpeed,
      projectileModel: this.projectileModel,
      projectileRadius: this.projectileRadius,
    });
  }
}
