import { AutoAimingProcessorPlugin } from './auto-aiming-processor-plugin';
import { DamageProcessorPlugin } from './damage-processor-plugin';
import { EffectsProcessorPlugin } from './effects-processor-plugin';
import { GameOverProcessorPlugin } from './game-over-processor-plugin';
import { ReaperPlugin } from './reaper-plugin';
import { FightSystemPlugin } from './fight-system-plugin';
import { EnemySpawnerPlugin } from './enemy-spawner-plugin';
import { AiProcessorPlugin } from './ai-processor-plugin';
import { EnemiesDetectorPlugin } from './enemies-detector-plugin';
import { RenderProcessorPlugin } from './render-processor-plugin';
import { DayNightSimulatorPlugin } from './day-night-simulator-plugin';
import { GrassSpawnerPlugin } from './grass-spawner-plugin';
import { CollectProcessorPlugin } from './collect-processor-plugin';
import { CraftProcessorPlugin } from './craft-processor-plugin';
import { ItemsActivatorPlugin } from './items-activator-plugin';
import { MovementProcessorPlugin } from './movement-processor-plugin';
import { ThumbStickControllerPlugin } from './thumb-stick-controller-plugin';
import { TouchDeviceJammerPlugin } from './touch-device-jammer-plugin';

export const processorsPlugins = {
  autoAimingProcessor: AutoAimingProcessorPlugin,
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  gameOverProcessor: GameOverProcessorPlugin,
  reaper: ReaperPlugin,
  fightSystem: FightSystemPlugin,
  enemySpawner: EnemySpawnerPlugin,
  aiProcessor: AiProcessorPlugin,
  enemiesDetector: EnemiesDetectorPlugin,
  customRenderer: RenderProcessorPlugin,
  dayNightSimulator: DayNightSimulatorPlugin,
  grassSpawner: GrassSpawnerPlugin,
  collectProcessor: CollectProcessorPlugin,
  craftProcessor: CraftProcessorPlugin,
  itemsActivator: ItemsActivatorPlugin,
  movementProcessor: MovementProcessorPlugin,
  thumbStickController: ThumbStickControllerPlugin,
  touchDeviceJammer: TouchDeviceJammerPlugin,
};
