import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import GameOverProcessorPlugin from './gameOverProcessorPlugin/gameOverProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';
import FightProcessorPlugin from './fightProcessorPlugin/fightProcessorPlugin';
import EnemySpawnerPlugin from './enemySpawnerPlugin/enemySpawnerPlugin';
import AiProcessorPlugin from './aiProcessorPlugin/aiProcessorPlugin';
import EnemiesDetectorPlugin from './enemiesDetectorPlugin/enemiesDetectorPlugin';
import RenderProcessorPlugin from './renderProcessorPlugin/renderProcessorPlugin';

export default {
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  gameOverProcessor: GameOverProcessorPlugin,
  reaper: ReaperPlugin,
  fightProcessor: FightProcessorPlugin,
  enemySpawner: EnemySpawnerPlugin,
  aiProcessor: AiProcessorPlugin,
  enemiesDetector: EnemiesDetectorPlugin,
  customRenderer: RenderProcessorPlugin,
};
