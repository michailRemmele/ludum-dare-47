import { EffectsSystem } from 'game/systems/effects-system';

export const ACTIVE_EFFECTS_COMPONENT_NAME = 'activeEffects';

export class EffectsSystemPlugin {
  async load(options) {
    const {
      helpers,
      createEntityObserver,
      entitySpawner,
      messageBus,
    } = options;

    const { effects } = await helpers.loadEffects();

    return new EffectsSystem({
      entityObserver: createEntityObserver({
        components: [
          ACTIVE_EFFECTS_COMPONENT_NAME,
        ],
      }),
      entitySpawner,
      effects,
      messageBus,
    });
  }
}
