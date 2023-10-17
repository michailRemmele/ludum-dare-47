import { Effect } from '../systems/effects-system';
import { Movement } from '../components';

class Fetter extends Effect {
  constructor(gameObject) {
    super();

    this._gameObject = gameObject;
  }

  apply() {
    const movement = this._gameObject.getComponent(Movement);

    if (!movement) {
      return;
    }

    movement.penalty += movement.speed;
  }

  onCancel() {
    const movement = this._gameObject.getComponent(Movement);

    if (!movement) {
      return;
    }

    movement.penalty -= movement.speed;
  }
}

export default Fetter;
