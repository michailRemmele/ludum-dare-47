import { Effect } from '../systems/effects-system';
import { Movement } from '../components';

class Fetter extends Effect {
  constructor(actor) {
    super();

    this._actor = actor;
  }

  apply() {
    const movement = this._actor.getComponent(Movement);

    if (!movement) {
      return;
    }

    movement.penalty += movement.speed;
  }

  onCancel() {
    const movement = this._actor.getComponent(Movement);

    if (!movement) {
      return;
    }

    movement.penalty -= movement.speed;
  }
}

export default Fetter;
