const WEAPON_COMPONENT_NAME = 'weapon';

class Fighter {
  constructor(gameObject, spawner) {
    this.gameObject = gameObject;
    this.spawner = spawner;

    const { properties, cooldown } = gameObject.getComponent(WEAPON_COMPONENT_NAME);

    this.properties = properties;
    this.cooldown = cooldown;

    this._cooldownRemaining = 0;
  }

  isReady() {
    return this._cooldownRemaining <= 0;
  }

  tick(deltaTime) {
    if (this._cooldownRemaining > 0) {
      this._cooldownRemaining -= deltaTime;
    }
  }

  createAttack() {
    throw new Error('You should override this function');
  }
}

export default Fighter;
