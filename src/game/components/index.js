import AimRadius from './aimRadius/AimRadius';
import { Effect } from './effect';
import { ActiveEffects } from './activeEffects';
import Health from './health/health';
import HitBox from './hitBox/hitBox';
import AI from './ai/ai';
import Collectable from './collectable/collectable';
import Weapon from './weapon/weapon';
import ThumbStickControl from './thumbStickControl/thumbStickControl';
import Movement from './movement/movement';
import ViewDirection from './viewDirection/viewDirection';

export default {
  aimRadius: AimRadius,
  effect: Effect,
  activeEffects: ActiveEffects,
  health: Health,
  hitBox: HitBox,
  ai: AI,
  collectable: Collectable,
  weapon: Weapon,
  thumbStickControl: ThumbStickControl,
  movement: Movement,
  viewDirection: ViewDirection,
};
