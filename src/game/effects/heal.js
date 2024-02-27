import { Effect } from '../systems/effects-system';
import { Health } from '../components';

class Heal extends Effect {
  constructor(actor, options) {
    super();

    this._actor = actor;
    this._value = options.value;
  }

  apply() {
    const health = this._actor.getComponent(Health);

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
