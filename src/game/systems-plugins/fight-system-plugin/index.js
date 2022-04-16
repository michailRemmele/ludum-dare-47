import { FightSystem } from 'game/systems/fight-system';

const WEAPON_COMPONENT_NAME = 'weapon';

export class FightSystemPlugin {
  load(options) {
    return new FightSystem({
      entitySpawner: options.entitySpawner,
      entityObserver: options.createEntityObserver({
        components: [
          WEAPON_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
