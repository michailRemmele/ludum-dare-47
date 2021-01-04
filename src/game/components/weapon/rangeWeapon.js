class RangeWeapon {
  constructor(config) {
    this._damage = config.damage;
    this._range = config.range;
    this._projectileSpeed = config.projectileSpeed;
    this._projectileModel = config.projectileModel;
    this._projectileRadius = config.projectileRadius;
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

  set projectileSpeed(projectileSpeed) {
    this._projectileSpeed = projectileSpeed;
  }

  get projectileSpeed() {
    return this._projectileSpeed;
  }

  set projectileModel(projectileModel) {
    this._projectileModel = projectileModel;
  }

  get projectileModel() {
    return this._projectileModel;
  }

  set projectileRadius(projectileRadius) {
    this._projectileRadius = projectileRadius;
  }

  get projectileRadius() {
    return this._projectileRadius;
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

export default RangeWeapon;
