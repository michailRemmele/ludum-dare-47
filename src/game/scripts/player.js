import { MathOps } from '@flyer-engine/core';

const LIGHT_COMPONENT_NAME = 'light';

export class Player {
  constructor({
    gameObject,
    gameObjectObserver,
    skyId,
    threshold,
  }) {
    this.gameObject = gameObject;
    this.sky = gameObjectObserver.getById(skyId);
    this.threshold = threshold;
  }

  update() {
    const skyLight = this.sky.getComponent(LIGHT_COMPONENT_NAME);
    const playerLight = this.gameObject.getComponent(LIGHT_COMPONENT_NAME);

    playerLight.options.intensity = MathOps.clamp(
      this.threshold - skyLight.options.intensity,
      0,
      this.threshold
    );
  }
}
