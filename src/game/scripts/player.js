import { MathOps, Light } from 'remiz';

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
    const skyLight = this.sky.getComponent(Light);
    const playerLight = this.gameObject.getComponent(Light);

    playerLight.options.intensity = MathOps.clamp(
      this.threshold - skyLight.options.intensity,
      0,
      this.threshold
    );
  }
}
