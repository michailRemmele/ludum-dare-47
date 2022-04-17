import { AutoAimingSystemPlugin } from './auto-aiming-system-plugin';
import { DamageSystemPlugin } from './damage-system-plugin';
import { EffectsSystemPlugin } from './effects-system-plugin';
import { GameOverSystemPlugin } from './game-over-system-plugin';
import { ReaperPlugin } from './reaper-plugin';
import { FightSystemPlugin } from './fight-system-plugin';
import { EnemySpawnerPlugin } from './enemy-spawner-plugin';
import { AISystemPlugin } from './ai-system-plugin';
import { EnemiesDetectorPlugin } from './enemies-detector-plugin';
import { DayNightSimulatorPlugin } from './day-night-simulator-plugin';
import { GrassSpawnerPlugin } from './grass-spawner-plugin';
import { CollectSystemPlugin } from './collect-system-plugin';
import { CraftSystemPlugin } from './craft-system-plugin';
import { ItemsActivatorPlugin } from './items-activator-plugin';
import { MovementSystemPlugin } from './movement-system-plugin';
import { ThumbStickControllerPlugin } from './thumb-stick-controller-plugin';
import { TouchDeviceJammerPlugin } from './touch-device-jammer-plugin';

export const systemsPlugins = {
  autoAimingSystem: AutoAimingSystemPlugin,
  damageSystem: DamageSystemPlugin,
  effectsSystem: EffectsSystemPlugin,
  gameOverSystem: GameOverSystemPlugin,
  reaper: ReaperPlugin,
  fightSystem: FightSystemPlugin,
  enemySpawner: EnemySpawnerPlugin,
  aiSystem: AISystemPlugin,
  enemiesDetector: EnemiesDetectorPlugin,
  dayNightSimulator: DayNightSimulatorPlugin,
  grassSpawner: GrassSpawnerPlugin,
  collectSystem: CollectSystemPlugin,
  craftSystem: CraftSystemPlugin,
  itemsActivator: ItemsActivatorPlugin,
  movementSystem: MovementSystemPlugin,
  thumbStickController: ThumbStickControllerPlugin,
  touchDeviceJammer: TouchDeviceJammerPlugin,
};
