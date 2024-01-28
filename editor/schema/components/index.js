import { ai } from './ai';
import { autoAim } from './auto-aim';
import { collectable } from './collectable';
import { effect } from './effect';
import { health } from './health';
import { hitBox } from './hit-box';
import { movement } from './movement';
import { thumbStickControl } from './thumb-stick-control';
import { ui } from './ui';
import { viewDirection } from './view-direction';
import { weapon } from './weapon';

export const componentsSchema = {
  AI: ai,
  AutoAim: autoAim,
  Collectable: collectable,
  Effect: effect,
  Health: health,
  HitBox: hitBox,
  Movement: movement,
  ThumbStickControl: thumbStickControl,
  UI: ui,
  ViewDirection: viewDirection,
  Weapon: weapon,
};
