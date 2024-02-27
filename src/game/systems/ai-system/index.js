import {
  System,
  ColliderContainer,
  Actor,
  ActorCollection,
  AddActor,
  RemoveActor,
} from 'remiz';

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
    this.aiUnitsCollection.forEach(this._handleAddActor);
    this.aiUnitsCollection.addEventListener(AddActor, this._handleAddActor);
    this.aiUnitsCollection.addEventListener(RemoveActor, this._handleRemoveActor);
  }

  unmount() {
    this.aiUnitsCollection.forEach(this._handleRemoveActor);
    this.aiUnitsCollection.removeEventListener(AddActor, this._handleAddActor);
    this.aiUnitsCollection.removeEventListener(RemoveActor, this._handleRemoveActor);
  }

  _handleAddActor = (value) => {
    const actor = value instanceof Actor ? value : value.actor;

    const ai = actor.getComponent(AI);

    this.playersStrategies[actor.id] = new strategies[ai.strategy](
      actor, this.scene,
    );
  };

  _handleRemoveActor = (value) => {
    const actor = value instanceof Actor ? value : value.actor;

    delete this.playersStrategies[actor.id];
  };

  update(options) {
    const { deltaTime } = options;

    this.aiUnitsCollection.forEach((actor) => {
      this.playersStrategies[actor.id].update(deltaTime);
    });
  }
}

AISystem.systemName = 'AISystem';
