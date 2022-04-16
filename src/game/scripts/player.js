import { MathOps } from 'remiz';

const LIGHT_COMPONENT_NAME = 'light';

export class Player {
  constructor({
    entity,
    entityObserver,
    skyId,
    threshold,
  }) {
    this.entity = entity;
    this.sky = entityObserver.getById(skyId);
    this.threshold = threshold;
  }

  update() {
    const skyLight = this.sky.getComponent(LIGHT_COMPONENT_NAME);
    const playerLight = this.entity.getComponent(LIGHT_COMPONENT_NAME);

    playerLight.options.intensity = MathOps.clamp(
      this.threshold - skyLight.options.intensity,
      0,
      this.threshold
    );
  }
}
