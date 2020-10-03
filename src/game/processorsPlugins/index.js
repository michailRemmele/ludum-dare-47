import DamageProcessorPlugin from './damageProcessorPlugin/damageProcessorPlugin';
import EffectsProcessorPlugin from './effectsProcessorPlugin/effectsProcessorPlugin';
import GameOverProcessorPlugin from './gameOverProcessorPlugin/gameOverProcessorPlugin';
import ReaperPlugin from './reaperPlugin/reaperPlugin';
import FightProcessorPlugin from './fightProcessorPlugin/fightProcessorPlugin';


export default {
  damageProcessor: DamageProcessorPlugin,
  effectsProcessor: EffectsProcessorPlugin,
  gameOverProcessor: GameOverProcessorPlugin,
  reaper: ReaperPlugin,
  fightProcessor: FightProcessorPlugin,
};
