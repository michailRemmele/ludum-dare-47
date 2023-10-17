import { aiSystem } from './ai-system';
import { autoAimingSystem } from './auto-aiming-system';
import { collectSystem } from './collect-system';
import { craftSystem } from './craft-system';
import { damageSystem } from './damage-system';
import { dayNightSimulator } from './day-night-simulator';
import { effectsSystem } from './effects-system';
import { enemiesDetector } from './enemies-detector';
import { enemySpawner } from './enemy-spawner';
import { fightSystem } from './fight-system';
import { gameOverSystem } from './game-over-system';
import { grassSpawner } from './grass-spawner';
import { itemsActivator } from './items-activator';
import { movementSystem } from './movement-system';
import { reaper } from './reaper';
import { thumbStickController } from './thumb-stick-controller';
import { touchDeviceJammer } from './touch-device-jammer';

export const systemsSchema = {
  AISystem: aiSystem,
  AutoAimingSystem: autoAimingSystem,
  CollectSystem: collectSystem,
  CraftSystem: craftSystem,
  DamageSystem: damageSystem,
  DayNightSimulator: dayNightSimulator,
  EffectsSystem: effectsSystem,
  EnemiesDetector: enemiesDetector,
  EnemySpawner: enemySpawner,
  FightSystem: fightSystem,
  GameOverSystem: gameOverSystem,
  GrassSpawner: grassSpawner,
  ItemsActivator: itemsActivator,
  MovementSystem: movementSystem,
  Reaper: reaper,
  ThumbStickController: thumbStickController,
  TouchDeviceJammer: touchDeviceJammer,
};
