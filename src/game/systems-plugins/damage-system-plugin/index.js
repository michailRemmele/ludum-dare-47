import { DamageSystem } from 'game/systems/damage-system';

export class DamageSystemPlugin {
  load(options) {
    return new DamageSystem({
      messageBus: options.messageBus,
    });
  }
}
