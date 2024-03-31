import { InstantEffectApplicator } from './instant-effect-applicator';
import { DelayedEffectApplicator } from './delayed-effect-applicator';
import { PeriodicalEffectApplicator } from './periodical-effect-applicator';
import { ContinuousEffectApplicator } from './continuous-effect-applicator';
import { TimeLimitedEffectApplicator } from './time-limited-effect-applicator';

export const effectApplicators = {
  instant: InstantEffectApplicator,
  delayed: DelayedEffectApplicator,
  periodical: PeriodicalEffectApplicator,
  continuous: ContinuousEffectApplicator,
  timeLimited: TimeLimitedEffectApplicator,
};
