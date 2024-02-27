import {
  System,
  ActorCollection,
} from 'remiz';

import { EventType } from '../../../events';
import { Health } from '../../components';

export class DamageSystem extends System {
  constructor(options) {
    super();

    this.scene = options.scene;
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        Health,
      ],
    });
  }

  mount() {
    this.scene.addEventListener(EventType.Damage, this.handleDamage);
  }

  unmount() {
    this.scene.removeEventListener(EventType.Damage, this.handleDamage);
  }

  handleDamage = (event) => {
    const { target, value } = event;

    const health = target.getComponent(Health);

    if (!health) {
      return;
    }

    health.points -= Math.round(value);

    if (health.points <= 0) {
      health.points = 0;
      target.emit(EventType.Kill);
    }
  }
}

DamageSystem.systemName = 'DamageSystem';
