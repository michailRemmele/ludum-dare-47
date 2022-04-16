import { Effect } from '../systems/effects-system';

const HEALTH_COMPONENT_NAME = 'health';

class Heal extends Effect {
  constructor(entity, _messageBus, options) {
    super();

    this._entity = entity;
    this._value = options.value;
  }

  apply() {
    const health = this._entity.getComponent(HEALTH_COMPONENT_NAME);

    if (!health) {
      return;
    }

    health.points += this._value;

    if (health.points > health.maxPoints) {
      health.points = health.maxPoints;
    }
  }
}

export default Heal;
