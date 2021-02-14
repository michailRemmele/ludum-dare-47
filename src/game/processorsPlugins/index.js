import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import GameOverProcessorPlugin from './gameOverProcessorPlugin/gameOverProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';
import FightSystemPlugin from './fightSystemPlugin/fightSystemPlugin';
import EnemySpawnerPlugin from './enemySpawnerPlugin/enemySpawnerPlugin';
import AiProcessorPlugin from './aiProcessorPlugin/aiProcessorPlugin';
import EnemiesDetectorPlugin from './enemiesDetectorPlugin/enemiesDetectorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';
import DayNightSimulatorPlugin from './dayNightSimulatorPlugin/dayNightSimulatorPlugin';
import GrassSpawnerPlugin from './grassSpawnerPlugin/grassSpawnerPlugin';
import CollectProcessorPlugin from './collectProcessorPlugin/collectProcessorPlugin';
import CraftProcessorPlugin from './craftProcessorPlugin/craftProcessorPlugin';
import ItemsActivatorPlugin from './itemsActivatorPlugin/itemsActivatorPlugin';
import MovementProcessorPlugin from './movementProcessorPlugin/movementProcessorPlugin';
import ThumbStickControllerPlugin from './thumbStickControllerPlugin/thumbStickControllerPlugin';
import TouchDeviceJammerPlugin from './touchDeviceJammerPlugin/touchDeviceJammerPlugin';

export default {
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
