import { AISystem } from './ai-system';
import { AutoAimingSystem } from './auto-aiming-system';
import { CollectSystem } from './collect-system';
import { CraftSystem } from './craft-system';
import { DamageSystem } from './damage-system';
import { DayNightSimulator } from './day-night-simulator';
import { EffectsSystem } from './effects-system';
import { EnemiesDetector } from './enemies-detector';
import { EnemySpawner } from './enemy-spawner';
import { FightSystem } from './fight-system';
import { GameOverSystem } from './game-over-system';
import { GrassSpawner } from './grass-spawner';
import { ItemsActivator } from './items-activator';
import { MovementSystem } from './movement-system';
import { Reaper } from './reaper';
import { ThumbStickController } from './thumb-stick-controller';
import { TouchDeviceJammer } from './touch-device-jammer';

export const systems = {
  aiSystem: AISystem,
  autoAimingSystem: AutoAimingSystem,
  collectSystem: CollectSystem,
  craftSystem: CraftSystem,
  damageSystem: DamageSystem,
  dayNightSimulator: DayNightSimulator,
  effectsSystem: EffectsSystem,
  enemiesDetector: EnemiesDetector,
  enemySpawner: EnemySpawner,
  fightSystem: FightSystem,
  gameOverSystem: GameOverSystem,
  grassSpawner: GrassSpawner,
  itemsActivator: ItemsActivator,
  movementSystem: MovementSystem,
  reaper: Reaper,
  thumbStickController: ThumbStickController,
  touchDeviceJammer: TouchDeviceJammer,
};
