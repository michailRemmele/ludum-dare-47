import React from 'react';
import PropTypes from 'prop-types';

import { Health } from '../../../game/components';
import { CollectService, TimeService } from '../../../game/systems';
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
import { PLAYER_ID } from '../../../consts/game-objects';

import './style.css';

const VICTORY_MSG = 'VICTORY';
const DEFEAT_MSG = 'DEFEAT';
const TOGGLE_INVENTORY_MSG = 'TOGGLE_INVENTORY';
const CLOSE_INVENTORY_MSG = 'CLOSE_INVENTORY';
const LOAD_SCENE_MSG = 'LOAD_SCENE';
const CRAFT_RECIPE_MSG = 'CRAFT_RECIPE';
const GRAB_MSG = 'GRAB';
const ATTACK_MSG = 'ATTACK';
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
  }

  componentWillUnmount() {
    this.props.gameStateObserver.unsubscribe(this.onGameStateUpdate);
  }

  onGameStateUpdate = () => {
    this.handlePlayerUpdate();
    this.handleMessagesUpdate();
    this.handleGUIUpdate();
  }

  handleGUIUpdate() {
    const collectService = this.props.sceneContext.getService(CollectService);
    const timeService = this.props.sceneContext.getService(TimeService);
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

  handleMessagesUpdate() {
    if (this.props.messageBus.get(VICTORY_MSG)) {
      this.setState({ pageState: PAGE_STATE.VICTORY });
    } else if (this.props.messageBus.get(DEFEAT_MSG)) {
      this.setState({ pageState: PAGE_STATE.DEFEAT });
    }

    const pageState = this.state.pageState;
    const toggleInventoryMessages = this.props.messageBus.get(TOGGLE_INVENTORY_MSG);
    const closeInventoryMessages = this.props.messageBus.get(CLOSE_INVENTORY_MSG);
    if (toggleInventoryMessages && pageState === PAGE_STATE.GAME) {
      this.setState({ pageState: PAGE_STATE.INVENTORY });
    } else if (
      (toggleInventoryMessages || closeInventoryMessages) &&
      pageState === PAGE_STATE.INVENTORY
    ) {
      this.setState({ pageState: PAGE_STATE.GAME });
    }
  }

  handlePlayerUpdate() {
    const gameObject = this.props.gameObjectObserver.getById(PLAYER_ID);
    const health = gameObject?.getComponent(Health);

    if (!gameObject || !health) {
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

    const gameObjectId = gameObject.getId();

    if (gameObjectId !== this.state.gameObjectId) {
      newState.gameObjectId = gameObjectId;
      newState.gameObject = gameObject;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }
  }

  onCollectItem = (event) => {
    event.stopPropagation();

    this.props.pushMessage({
      type: GRAB_MSG,
      id: this.state.gameObjectId,
      gameObject: this.state.gameObject,
    });
  }

  onInventoryToggle = (event) => {
    if (event) {
      event.stopPropagation();
    }

    this.props.pushMessage({
      type: TOGGLE_INVENTORY_MSG,
    });
  }

  onCraft = (recipe) => {
    this.props.pushMessage({
      type: CRAFT_RECIPE_MSG,
      recipe,
    });
  }

  onRestart() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      sceneId: GAME_SCENE_ID,
      loaderId: LOADER_ID,
      unloadCurrent: true,
      clean: true,
    });
  }

  onMainMenu() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      sceneId: MAIN_MENU_SCENE_ID,
      unloadCurrent: true,
    });
  }

  onAttack = () => {
    this.props.pushMessage({
      type: ATTACK_MSG,
      id: this.state.gameObjectId,
      gameObject: this.state.gameObject,
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
              user={this.state.gameObject}
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
                user={this.state.gameObject}
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
  gameObjectObserver: PropTypes.any,
  messageBus: PropTypes.any,
  sceneContext: PropTypes.any,
  pushMessage: PropTypes.func,
  touchDevice: PropTypes.bool,
};

export const WrappedGame = withDeviceDetection(withGame(Game));
