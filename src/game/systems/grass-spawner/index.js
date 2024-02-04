import { GameObjectObserver, MathOps, System, Transform } from 'remiz';

import { EventType } from '../../../events';
import { TimeService } from '../';
import { Collectable } from '../../components';

const SPAWN_COOLDOWN = 2000;
const START_SPAWN_HOUR = 9;
const END_SPAWN_HOUR = 18;
const KILL_GRASS_HOUR = 0;

const GRASS_TEMPLATES = [
  '8fcc3d22-c360-41cb-aa7b-0ac39b74db95',
  '2aa2d307-1a4f-4fe4-ac4c-2a4e6900ed16',
  '2241aceb-0112-4ad4-9c0c-9c05f6d4ba47',
];

export class GrassSpawner extends System {
  constructor(options) {
    super();

    this.gameObjectObserver = new GameObjectObserver(options.scene, {
      components: [ Collectable ],
    });
    this.gameObjectSpawner = options.gameObjectSpawner;
    this.timeService = options.scene.getService(TimeService);

    this._islandSize = {
      minX: -180,
      maxX: 180,
      minY: -180,
      maxY: 180,
    };
    this._cooldown = 0;
  }

  update(options) {
    const { deltaTime } = options;

    if (this._cooldown > 0) {
      this._cooldown -= deltaTime;
      return;
    }

    const hour = this.timeService.getHours();

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const templateIndex = MathOps.random(0, GRASS_TEMPLATES.length - 1);
      const grass = this.gameObjectSpawner.spawn(GRASS_TEMPLATES[templateIndex]);
      const grassTransform = grass.getComponent(Transform);

      grassTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      grassTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._cooldown = SPAWN_COOLDOWN;
    }

    if (hour >= KILL_GRASS_HOUR && hour < START_SPAWN_HOUR) {
      this.gameObjectObserver.forEach((gameObject) => {
        gameObject.emit(EventType.Kill);
      });
    }
  }
}

GrassSpawner.systemName = 'GrassSpawner';
