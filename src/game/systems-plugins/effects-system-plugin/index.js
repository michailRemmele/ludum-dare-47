import { EffectsSystem } from 'game/systems/effects-system';

export const ACTIVE_EFFECTS_COMPONENT_NAME = 'activeEffects';

export class EffectsSystemPlugin {
  async load(options) {
    const {
      helpers,
      createGameObjectObserver,
      gameObjectSpawner,
      messageBus,
    } = options;

    const { effects } = await helpers.loadEffects();

    return new EffectsSystem({
      gameObjectObserver: createGameObjectObserver({
        components: [
          ACTIVE_EFFECTS_COMPONENT_NAME,
        ],
      }),
      gameObjectSpawner,
      effects,
      messageBus,
    });
  }
}
