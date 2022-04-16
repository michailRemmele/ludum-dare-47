import { Effect } from '../systems/effects-system';

const MOVEMENT_COMPONENT_NAME = 'movement';

class Fetter extends Effect {
  constructor(entity) {
    super();

    this._entity = entity;
  }

  apply() {
    const movement = this._entity.getComponent(MOVEMENT_COMPONENT_NAME);

    if (!movement) {
      return;
    }

    movement.penalty += movement.speed;
  }

  onCancel() {
    const movement = this._entity.getComponent(MOVEMENT_COMPONENT_NAME);

    if (!movement) {
      return;
    }

    movement.penalty -= movement.speed;
  }
}

export default Fetter;
