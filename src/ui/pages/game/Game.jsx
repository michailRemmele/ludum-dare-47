import React from 'react';
import PropTypes from 'prop-types';
import { LoadScene } from 'remiz/events';

import { EventType } from '../../../events';
import { Health, AutoAim } from '../../../game/components';
import { TimeService } from '../../../game/systems';
import { CollectService } from '../../../game/scripts';
import {
  withGame,
  withDeviceDetection,
  HealthBar,
  EffectsBar,
  Inventory,
  Button,
  ItemsBarContainer,
  GameStatsMeter,
} from '../../elements/common';
import {
  ThumbStick,
  MenuButton,
  ControlButton,
} from '../../elements/touch';
import {
  ActionBar,
} from '../../elements/desktop';
import { PLAYER_ID } from '../../../consts/actors';

import './style.css';

const GAME_SCENE_ID = 'a6d997de-cc8d-4d61-9fcb-932179c32142';
const MAIN_MENU_SCENE_ID = '5d78b760-d3ae-4966-ad0c-7942a54006f2';
const LOADER_ID = '3c4c020d-bcf7-4644-893f-fa72335b352e';

const DEV_MODE = 'development';

const PAGE_STATE = {
  GAME: 'game',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  INVENTORY: 'inventory',
};

export class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageState: PAGE_STATE.GAME,
    };

    this.renderStateStrategy = {
      [PAGE_STATE.GAME]: () => this.renderHud(),
      [PAGE_STATE.VICTORY]: () => (
        <>
          {this.renderHud()}
          <div className='game__overlay'>
            {this.renderVictoryDialog()}
          </div>
        </>
      ),
      [PAGE_STATE.DEFEAT]: () => (
        <>
          {this.renderHud()}
          <div className='game__overlay'>
            {this.renderDefeatDialog()}
          </div>
        </>
      ),
      [PAGE_STATE.INVENTORY]: () => (
        <>
          {this.renderHud()}
          <div className='game__overlay'>
            <Inventory
              className='game__inventory'
              healGrass={this.state.healGrass}
              ogreGrass={this.state.ogreGrass}
              boomGrass={this.state.boomGrass}
              onCraft={this.onCraft}
              onLeave={this.onInventoryToggle}
            />
          </div>
        </>
      ),
    };
  }

  componentDidMount() {
    this.props.gameStateObserver.subscribe(this.onGameStateUpdate);
    this.props.scene.addEventListener(EventType.Victory, this.handleVictory);
    this.props.scene.addEventListener(EventType.Defeat, this.handleDefeat);
    this.props.scene.addEventListener(EventType.ToggleInventory, this.handleToggleInventory);
    this.props.scene.addEventListener(EventType.CloseInventory, this.handleCloseInventory);
  }

  componentWillUnmount() {
    this.props.gameStateObserver.unsubscribe(this.onGameStateUpdate);
    this.props.scene.removeEventListener(EventType.Victory, this.handleVictory);
    this.props.scene.removeEventListener(EventType.Defeat, this.handleDefeat);
    this.props.scene.removeEventListener(EventType.ToggleInventory, this.handleToggleInventory);
    this.props.scene.removeEventListener(EventType.CloseInventory, this.handleCloseInventory);
  }

  handleVictory = () => {
    this.setState({ pageState: PAGE_STATE.VICTORY });
  }

  handleDefeat = () => {
    this.setState({ pageState: PAGE_STATE.DEFEAT });
  }

  handleToggleInventory = () => {
    if (this.state.pageState === PAGE_STATE.GAME) {
      this.setState({ pageState: PAGE_STATE.INVENTORY });
    } else if (this.state.pageState === PAGE_STATE.INVENTORY) {
      this.setState({ pageState: PAGE_STATE.GAME });
    }
  }

  handleCloseInventory = () => {
    if (this.state.pageState === PAGE_STATE.INVENTORY) {
      this.setState({ pageState: PAGE_STATE.GAME });
    }
  }

  onGameStateUpdate = () => {
    this.handlePlayerUpdate();
    this.handleGUIUpdate();
  }

  handleGUIUpdate() {
    const collectService = this.props.scene.getService(CollectService);
    const timeService = this.props.scene.getService(TimeService);
    const collectableItems = collectService.getCollectableItems();
    const inventory = collectService.getInventory();

    const canGrab = !!collectableItems.size;

    if (canGrab !== this.state.canGrab) {
      this.setState({
        canGrab: !!collectableItems.size,
      });
    }

    const { healGrass, ogreGrass, boomGrass } = inventory;

    if (
      healGrass !== this.state.healGrass
      || ogreGrass !== this.state.ogreGrass
      || boomGrass !== this.state.boomGrass
    ) {
      this.setState({
        healGrass,
        ogreGrass,
        boomGrass,
      });
    }

    const days = timeService.getDays();

    if (days !== this.state.days) {
      this.setState({
        days,
      });
    }
  }

  handlePlayerUpdate() {
    const actor = this.props.scene.getEntityById(PLAYER_ID);
    const health = actor?.getComponent(Health);

    if (!actor || !health) {
      this.setState({
        health: 0,
        maxHealth: 0,
      });
      return;
    }

    const newState = {};

    if (health.points !== this.state.health || health.maxPoints !== this.state.maxHealth) {
      newState.health = health.points;
      newState.maxHealth = health.maxPoints;
    }

    if (actor !== this.state.actor) {
      newState.actor = actor;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  onCollectItem = (event) => {
    event.stopPropagation();

    this.state.actor.dispatchEvent(EventType.Grab);
  }

  onInventoryToggle = (event) => {
    if (event) {
      event.stopPropagation();
    }

    this.state.actor.dispatchEvent(EventType.ToggleInventory);
  }

  onCraft = (recipe) => {
    this.state.actor.dispatchEvent(EventType.CraftRecipe, { recipe });
  }

  onRestart() {
    this.props.scene.dispatchEvent(LoadScene, {
      sceneId: GAME_SCENE_ID,
      loaderId: LOADER_ID,
      unloadCurrent: true,
      clean: true,
    });
  }

  onMainMenu() {
    this.props.scene.dispatchEvent(LoadScene, {
      sceneId: MAIN_MENU_SCENE_ID,
      unloadCurrent: true,
    });
  }

  onAttack = () => {
    const autoAimObject = this.state.actor.children.find(
      (child) => child.getComponent(AutoAim)
    );
    const autoAim = autoAimObject.getComponent(AutoAim);

    this.state.actor.dispatchEvent(EventType.Attack, {
      x: autoAim.targetX,
      y: autoAim.targetY,
    });
  }

  renderActionBar() {
    if (!this.state.canGrab) {
      return;
    }

    return (
      <ActionBar
        className='game__action-bar'
        onClick={this.onCollectItem}
        keyName='E'
        title='Collect'
      />
    );
  }

  renderDialog(title) {
    return (
      <div className='game__dialog dialog'>
        <h2 className='dialog__title'>{title}</h2>
        <p className='dialog__description'>
          You survived {this.state.days} days
        </p>
        <footer className='dialog__footer'>
          <Button className='dialog__button' title='Restart' onClick={() => this.onRestart()} />
          <Button className='dialog__button' title='Main menu' onClick={() => this.onMainMenu()} />
        </footer>
      </div>
    );
  }

  renderDefeatDialog() {
    return this.renderDialog('Defeat');
  }

  renderVictoryDialog() {
    return this.renderDialog('Victory');
  }

  renderHud() {
    if (this.props.touchDevice) {
      return (
        <>
          <header className='game__header'>
            <div className='game__left-bar'>
              <HealthBar health={this.state.health} maxHealth={this.state.maxHealth}/>
              <EffectsBar className='game__effects-bar' />
              {process.env.NODE_ENV === DEV_MODE && (
                <GameStatsMeter className='game__game-stats-meter'/>
              )}
            </div>
            <MenuButton icon='./media/images/inventory-icon.png' onClick={this.onInventoryToggle} />
          </header>
          <div className='game__main'>
            <ItemsBarContainer
              user={this.state.actor}
            />
          </div>
          <footer className='game__footer game__footer_touch'>
            <ThumbStick className='game__thumb-stick'/>
            <div className='game__control-bar'>
              {this.state.canGrab && (
                <ControlButton
                  className='control-bar__button control-bar__button_grab'
                  icon='./media/images/grab-icon.png'
                  onClick={this.onCollectItem}
                />
              )}
              <ControlButton
                className='control-bar__button control-bar__button_attack'
                icon='./media/images/attack-icon.png'
                size='lg'
                onClick={this.onAttack}
              />
            </div>
          </footer>
        </>
      );
    } else {
      return (
        <>
          <header className='game__header'>
            <div className='game__left-bar'>
              <HealthBar health={this.state.health}/>
              <EffectsBar className='game__effects-bar' />
              {process.env.NODE_ENV === DEV_MODE && <GameStatsMeter className='game__game-stats-meter'/>}
            </div>
            <ActionBar
              onClick={this.onInventoryToggle}
              keyName='I'
              title='Inventory'
            />
          </header>
          <footer className='game__footer'>
            <div className='game__bars'>
              <ItemsBarContainer
                user={this.state.actor}
              />
              {this.renderActionBar()}
            </div>
          </footer>
        </>
      );
    }
  }

  render() {
    return (
      <div className={`game${this.props.touchDevice ? ' game_touch' : ''}`}>
        {this.renderStateStrategy[this.state.pageState]()}
      </div>
    );
  }
}

Game.propTypes = {
  gameStateObserver: PropTypes.any,
  scene: PropTypes.any,
  touchDevice: PropTypes.bool,
};

export const WrappedGame = withDeviceDetection(withGame(Game));
