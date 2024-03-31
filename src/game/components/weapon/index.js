import { Component } from 'remiz';

import { MeleeWeapon } from './melee-weapon';
import { RangeWeapon } from './range-weapon';

const weapons = {
  melee: MeleeWeapon,
  range: RangeWeapon,
};

export class Weapon extends Component {
  constructor(config) {
    super(config);

    this.type = config.type;
    this.cooldown = config.cooldown;
    this.cooldownRemaining = 0;
    this.isActive = false;

    if (!weapons[this.type]) {
      throw new Error(`Not found weapon with same type: ${this.type}`);
    }

    this.properties = new weapons[this.type](config.properties);
  }

  clone() {
    return new Weapon({
      type: this.type,
      cooldown: this.cooldown,
      properties: this.properties.clone(),
    });
  }
}

Weapon.componentName = 'Weapon';
