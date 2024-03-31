import {
  Engine,

  Animator,
  CameraSystem,
  GameStatsMeter,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseControlSystem,
  MouseInputSystem,
  PhysicsSystem,
  ScriptSystem,
  SpriteRenderer,
  UiBridge,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Sprite,
  Transform,
  MouseControl,
  ScriptBundle,
  Light,
} from 'remiz';

import config from 'resources/config.json';
import {
  AISystem,
  DamageSystem,
  DayNightSimulator,
  EffectsSystem,
  EnemySpawner,
  FightSystem,
  GrassSpawner,
  MovementSystem,
  Reaper,
  ThumbStickController,
} from './game/systems';
import {
  ActiveEffects,
  AI,
  AutoAim,
  Collectable,
  Effect,
  Health,
  HitBox,
  Movement,
  ThumbStickControl,
  UI,
  ViewDirection,
  Weapon,
} from 'game/components';
import { scripts } from 'game/scripts';
import { effects } from 'game/effects';
import {
  isIosSafari,
  isIos,
  applyIosSafariScreenFix,
  applyIosChromeScreenFix,
} from './utils';

const options = {
  config,
  systems: [
    Animator,
    CameraSystem,
    GameStatsMeter,
    KeyboardInputSystem,
    KeyboardControlSystem,
    MouseControlSystem,
    MouseInputSystem,
    PhysicsSystem,
    ScriptSystem,
    SpriteRenderer,
    UiBridge,
    AISystem,
    DamageSystem,
    DayNightSimulator,
    EffectsSystem,
    EnemySpawner,
    FightSystem,
    GrassSpawner,
    MovementSystem,
    Reaper,
    ThumbStickController,
  ],
  components: [
    Camera,
    KeyboardControl,
    ColliderContainer,
    RigidBody,
    Animatable,
    Sprite,
    Transform,
    MouseControl,
    ScriptBundle,
    Light,
    ActiveEffects,
    AI,
    AutoAim,
    Collectable,
    Effect,
    Health,
    HitBox,
    Movement,
    ThumbStickControl,
    UI,
    ViewDirection,
    Weapon,
  ],
  resources: {
    [ScriptSystem.systemName]: scripts,
    [EffectsSystem.systemName]: effects,
    [UiBridge.systemName]: {
      loadUiApp: () => import('ui'),
    },
  },
};

const engine = new Engine(options);
engine.play();

console.log('Hello! You can contact the author via email: mikhail.remmele@gmail.com');

if (isIosSafari()) {
  applyIosSafariScreenFix();
} else if (isIos()) {
  applyIosChromeScreenFix();
}
