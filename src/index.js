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
  Renderer,
  UiBridge,

  Camera,
  KeyboardControl,
  ColliderContainer,
  RigidBody,
  Animatable,
  Renderable,
  Transform,
  MouseControl,
  Script,
  Light,
} from 'remiz';

import config from 'resources/config.json';
import {
  AISystem,
  AutoAimingSystem,
  CollectSystem,
  CraftSystem,
  DamageSystem,
  DayNightSimulator,
  EffectsSystem,
  EnemiesDetector,
  EnemySpawner,
  FightSystem,
  GameOverSystem,
  GrassSpawner,
  ItemsActivator,
  MovementSystem,
  Reaper,
  ThumbStickController,
  TouchDeviceJammer,
} from './game/systems';
import {
  ActiveEffects,
  AI,
  AimRadius,
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
    Renderer,
    UiBridge,
    AISystem,
    AutoAimingSystem,
    CollectSystem,
    CraftSystem,
    DamageSystem,
    DayNightSimulator,
    EffectsSystem,
    EnemiesDetector,
    EnemySpawner,
    FightSystem,
    GameOverSystem,
    GrassSpawner,
    ItemsActivator,
    MovementSystem,
    Reaper,
    ThumbStickController,
    TouchDeviceJammer,
  ],
  components: [
    Camera,
    KeyboardControl,
    ColliderContainer,
    RigidBody,
    Animatable,
    Renderable,
    Transform,
    MouseControl,
    Script,
    Light,
    ActiveEffects,
    AI,
    AimRadius,
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
