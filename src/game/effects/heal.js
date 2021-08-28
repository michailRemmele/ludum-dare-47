import { Effect } from '../processors/effectsProcessor';

const HEALTH_COMPONENT_NAME = 'health';

class Heal extends Effect {
  constructor(gameObject, _messageBus, options) {
    super();

    this._gameObject = gameObject;
    this._value = options.value;
  }

  apply() {
    const health = this._gameObject.getComponent(HEALTH_COMPONENT_NAME);

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
