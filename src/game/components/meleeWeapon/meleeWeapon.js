import { Component } from '@flyer-engine/core';

class MeleeWeapon extends Component {
  constructor(config) {
    super();

    this._name = config.name;
    this._damage = config.damage;
    this._range = config.range;
    this._cooldown = config.cooldown;
    this._cooldownRemaining = 0;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
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

  set cooldown(cooldown) {
    this._cooldown = cooldown;
  }

  get cooldown() {
    return this._cooldown;
  }

  set cooldownRemaining(cooldownRemaining) {
    this._cooldownRemaining = cooldownRemaining;
  }

  get cooldownRemaining() {
    return this._cooldownRemaining;
  }

  clone() {
    return new MeleeWeapon({
      name: this.name,
      damage: this.damage,
      range: this.range,
      cooldown: this.cooldown,
    });
  }
}

export default MeleeWeapon;
