import { MathOps } from 'remiz';

const TRANSFORM_COMPONENT_NAME = 'transform';

const KILL_MSG = 'KILL';

const SPAWN_COOLDOWN = 2000;
const START_SPAWN_HOUR = 9;
const END_SPAWN_HOUR = 18;
const KILL_GRASS_HOUR = 0;

const GRASS_PREFABS = [
  'healGrass',
  'ogreGrass',
  'boomGrass',
];

const TIME_OF_DAY_KEY = 'timeOfDay';

export class GrassSpawner {
  constructor(options) {
    this._entityObserver = options.entityObserver;
    this._entitySpawner = options.entitySpawner;
    this._store = options.store;
    this.messageBus = options.messageBus;

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

    const time = this._store.get(TIME_OF_DAY_KEY);
    const hour = time.getHours();

    if (hour >= START_SPAWN_HOUR && hour < END_SPAWN_HOUR) {
      const prefabName = MathOps.random(0, GRASS_PREFABS.length - 1);
      const grass = this._entitySpawner.spawn(GRASS_PREFABS[prefabName]);
      const grassTransform = grass.getComponent(TRANSFORM_COMPONENT_NAME);

      grassTransform.offsetX = MathOps.random(this._islandSize.minX, this._islandSize.maxX);
      grassTransform.offsetY = MathOps.random(this._islandSize.minY, this._islandSize.maxY);

      this._cooldown = SPAWN_COOLDOWN;
    }

    const grassCount = this._entityObserver.size();

    if (grassCount && hour >= KILL_GRASS_HOUR && hour < START_SPAWN_HOUR) {
      this._entityObserver.forEach((entity) => {
        this.messageBus.send({
          type: KILL_MSG,
          id: entity.getId(),
          entity: entity,
        });
      });
    }
  }
}
