import { aiSystem } from './ai-system';
import { damageSystem } from './damage-system';
import { dayNightSimulator } from './day-night-simulator';
import { effectsSystem } from './effects-system';
import { enemySpawner } from './enemy-spawner';
import { fightSystem } from './fight-system';
import { grassSpawner } from './grass-spawner';
import { movementSystem } from './movement-system';
import { reaper } from './reaper';
import { thumbStickController } from './thumb-stick-controller';

export const systemsSchema = {
  AISystem: aiSystem,
  DamageSystem: damageSystem,
  DayNightSimulator: dayNightSimulator,
  EffectsSystem: effectsSystem,
  EnemySpawner: enemySpawner,
  FightSystem: fightSystem,
  GrassSpawner: grassSpawner,
  MovementSystem: movementSystem,
  Reaper: reaper,
  ThumbStickController: thumbStickController,
};
