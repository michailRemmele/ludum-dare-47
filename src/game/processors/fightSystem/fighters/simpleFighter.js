import Fighter from './fighter';
import attacks from '../attacks';

const WEAPON_COMPONENT_NAME = 'weapon';

class SimpleFighter extends Fighter {
  constructor(gameObject, spawner, messageBus) {
    super();

    this._gameObject = gameObject;
    this._spawner = spawner;
    this._messageBus = messageBus;

    this._weapon = this._gameObject.getComponent(WEAPON_COMPONENT_NAME);
    this._weapon.cooldownRemaining = 0;
  }

  isReady() {
    return this._weapon.cooldownRemaining <= 0;
  }

  attack(angle) {
    if (!this.isReady()) {
      return;
    }

    const { type, cooldown } = this._weapon;

    const Attack = attacks[type];

    if (!Attack) {
      throw new Error(`Not found attack with same type: ${type}`);
    }

    this._weapon.cooldownRemaining = cooldown;

    return new Attack(this._gameObject, this._spawner, this._messageBus, angle);
  }

  process(deltaTime) {
    this._weapon.cooldownRemaining -= deltaTime;
  }
}

export default SimpleFighter;
