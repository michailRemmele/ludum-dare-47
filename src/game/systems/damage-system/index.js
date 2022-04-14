const DAMAGE_MSG = 'DAMAGE';
const KILL_MSG = 'KILL';

const HEALTH_COMPONENT_NAME = 'health';

export class DamageSystem {
  constructor(options) {
    this.messageBus = options.messageBus;
  }

  update() {
    const damageMessages = this.messageBus.get(DAMAGE_MSG) || [];
    damageMessages.forEach((message) => {
      const { gameObject, value } = message;

      const health = gameObject.getComponent(HEALTH_COMPONENT_NAME);

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
