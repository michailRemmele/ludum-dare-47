import { Component } from '@flyer-engine/core';

import MeleeWeapon from './meleeWeapon';
import RangeWeapon from './rangeWeapon';

class Weapon extends Component {
  constructor(config) {
    super();

    this._weapons = {
      melee: MeleeWeapon,
      range: RangeWeapon,
    };

    this._type = config.type;
    this._cooldown = config.cooldown;

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

  clone() {
    return new Weapon({
      type: this.type,
      cooldown: this.cooldown,
      properties: this.properties.clone(),
    });
  }
}

export default Weapon;
