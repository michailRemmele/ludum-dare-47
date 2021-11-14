import { EffectsProcessor } from 'game/processors/effectsProcessor';

export const ACTIVE_EFFECTS_COMPONENT_NAME = 'activeEffects';

export class EffectsProcessorPlugin {
  async load(options) {
    const {
      helpers,
      createGameObjectObserver,
      gameObjectSpawner,
    } = options;

    const { effects } = await helpers.loadEffects();

    return new EffectsProcessor({
      gameObjectObserver: createGameObjectObserver({
        components: [
          ACTIVE_EFFECTS_COMPONENT_NAME,
        ],
      }),
      gameObjectSpawner,
      effects,
    });
  }
}
