import {
  Engine,

  Animator,
  CameraSystem,
  GameStatsMeter,
  KeyboardInputSystem,
  KeyboardControlSystem,
  MouseControlSystem,
  MouseInputSystem,
  MouseInputCoordinatesProjector,
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
import helpers from './helpers';
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
    MouseInputCoordinatesProjector,
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
  helpers: {
    ...helpers,
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
