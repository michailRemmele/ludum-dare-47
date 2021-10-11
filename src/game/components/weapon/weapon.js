import { Component } from '@flyer-engine/core';

import MeleeWeapon from './meleeWeapon';
import RangeWeapon from './rangeWeapon';

class Weapon extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._weapons = {
      melee: MeleeWeapon,
      range: RangeWeapon,
    };

    this._type = config.type;
    this._cooldown = config.cooldown;
    this._cooldownRemaining = 0;

    if (!this._weapons[this.type]) {
      throw new Error(`Not found weapon with same type: ${this.type}`);
    }

    this._properties = new this._weapons[this.type](config.properties);
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set cooldown(cooldown) {
    this._cooldown = cooldown;
  }

  get cooldown() {
    return this._cooldown;
  }

  set properties(properties) {
    this._properties = properties;
  }

  get properties() {
    return this._properties;
  }

  set cooldownRemaining(cooldownRemaining) {
    this._cooldownRemaining = cooldownRemaining;
  }

  get cooldownRemaining() {
    return this._cooldownRemaining;
  }

  clone() {
    return new Weapon(this.componentName, {
      type: this.type,
      cooldown: this.cooldown,
      properties: this.properties.clone(),
    });
  }
}

export default Weapon;
