import { ai } from './ai';
import { aimRadius } from './aim-radius';
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
  AimRadius: aimRadius,
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
