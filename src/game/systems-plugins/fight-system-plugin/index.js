import { FightSystem } from 'game/systems/fight-system';

const WEAPON_COMPONENT_NAME = 'weapon';

export class FightSystemPlugin {
  load(options) {
    return new FightSystem({
      gameObjectSpawner: options.gameObjectSpawner,
      gameObjectObserver: options.createGameObjectObserver({
        components: [
          WEAPON_COMPONENT_NAME,
        ],
      }),
      messageBus: options.messageBus,
    });
  }
}
