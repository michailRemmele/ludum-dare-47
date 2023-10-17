import { DelayedEffectOptions } from './delayed';
import { PeriodicalEffectOptions } from './periodical';
import { TimeLimitedEffectOptions } from './time-limited';

export const applicatorOptions = {
  delayed: DelayedEffectOptions,
  periodical: PeriodicalEffectOptions,
  timeLimited: TimeLimitedEffectOptions,
};
