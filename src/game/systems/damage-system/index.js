import { System } from 'remiz';

import { Health } from '../../components';

const DAMAGE_MSG = 'DAMAGE';
const KILL_MSG = 'KILL';

export class DamageSystem extends System {
  constructor(options) {
    super();

    this.messageBus = options.messageBus;
  }

  update() {
    const damageMessages = this.messageBus.get(DAMAGE_MSG) || [];
    damageMessages.forEach((message) => {
      const { gameObject, value } = message;

      const health = gameObject.getComponent(Health);

      if (!health) {
        return;
      }

      health.points -= Math.round(value);

      if (health.points <= 0) {
        health.points = 0;

        this.messageBus.send({
          type: KILL_MSG,
          id: gameObject.getId(),
          gameObject: gameObject,
        });
      }
    });
  }
}

DamageSystem.systemName = 'DamageSystem';
