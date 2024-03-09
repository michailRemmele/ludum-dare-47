import {
  System,
  ColliderContainer,
  ActorCollection,
} from 'remiz';
import { RemoveActor } from 'remiz/events';

import { AI } from '../../components';

import { strategies } from './ai-strategies';

export class AISystem extends System {
  constructor(options) {
    super();

    this.scene = options.scene;
    this.aiUnitsCollection = new ActorCollection(options.scene, {
      components: [
        AI,
        ColliderContainer,
      ],
    });

    this.playersStrategies = {};
  }

  mount() {
    this.scene.addEventListener(RemoveActor, this._handleRemoveActor);
  }

  unmount() {
    this.scene.removeEventListener(RemoveActor, this._handleRemoveActor);
  }

  _handleRemoveActor = (event) => {
    delete this.playersStrategies[event.actor.id];
  };

  update(options) {
    const { deltaTime } = options;

    this.aiUnitsCollection.forEach((actor) => {
      if (!this.playersStrategies[actor.id]) {
        const ai = actor.getComponent(AI);

        this.playersStrategies[actor.id] = new strategies[ai.strategy](
          actor, this.scene,
        );
      }

      this.playersStrategies[actor.id].update(deltaTime);
    });
  }
}

AISystem.systemName = 'AISystem';
