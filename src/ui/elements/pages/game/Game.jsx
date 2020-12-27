import React from 'react';
import PropTypes from 'prop-types';

import { MathOps } from '@flyer-engine/core';

import withGame from '../../hocs/withGame/withGame';

import HealthBar from '../../components/healthBar/HealthBar';
import ActionBar from '../../components/actionBar/ActionBar';
import ItemsBar from '../../components/itemsBar/ItemsBar';
import Inventory from '../../components/inventory/Inventory';
import ThumbStick from '../../components/thumbStick/ThumbStick';
import Button from '../../atoms/button/Button';

import { isTouchDevice } from './utils';
import './style.css';

const VICTORY_MSG = 'VICTORY';
const DEFEAT_MSG = 'DEFEAT';
const TOGGLE_INVENTORY_MSG = 'TOGGLE_INVENTORY';
const CLOSE_INVENTORY_MSG = 'CLOSE_INVENTORY';
const LOAD_SCENE_MSG = 'LOAD_SCENE';
const CRAFT_RECIPE_MSG = 'CRAFT_RECIPE';
const GRAB_MSG = 'GRAB';
const MOVEMENT_MSG = 'MOVEMENT';
const GAME_SCENE_NAME = 'game';
const MAIN_MENU_SCENE_NAME = 'mainMenu';

const CAN_GRAB_KEY = 'canGrab';
const INVENTORY_KEY = 'inventory';
const TIME_OF_DAY_KEY = 'timeOfDay';

const PLAYER_ID = '1';
const HEALTH_COMPONENT_NAME = 'health';

const PAGE_STATE = {
  GAME: 'game',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
  INVENTORY: 'inventory',
};

class Game extends React.Component {
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
    this.messageBusSubscription = this.onMessageBusUpdate.bind(this);
    this.storeSubscription = this.onStoreUpdate.bind(this);
    this.playerSubscription = this.onPlayerUpdate.bind(this);

    this.isTouchDevice = isTouchDevice();
  }

  componentDidMount() {
    this.props.messageBusObserver.subscribe(this.messageBusSubscription);
    this.props.storeObserver.subscribe(this.storeSubscription);
    this.props.gameObjects.subscribe(this.playerSubscription, PLAYER_ID);
  }

  componentWillUnmount() {
    this.props.messageBusObserver.unsubscribe(this.messageBusSubscription);
    this.props.storeObserver.unsubscribe(this.storeSubscription);
    this.props.gameObjects.unsubscribe(this.playerSubscription, PLAYER_ID);
  }

  onStoreUpdate(store) {
    const canGrabSet = store.get(CAN_GRAB_KEY);

    const canGrab = !!canGrabSet.size;

    if (canGrab !== this.state.canGrab) {
      this.setState({
        canGrab: !!canGrabSet.size,
      });
    }

    const { healGrass, ogreGrass, boomGrass } = store.get(INVENTORY_KEY);

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

    const time = store.get(TIME_OF_DAY_KEY);
    const days = time.getDays();

    if (days !== this.state.days) {
      this.setState({
        days,
      });
    }
  }

  onMessageBusUpdate(messageBus) {
    if (messageBus.get(VICTORY_MSG)) {
      this.setState({ pageState: PAGE_STATE.VICTORY });
    } else if (messageBus.get(DEFEAT_MSG)) {
      this.setState({ pageState: PAGE_STATE.DEFEAT });
    }

    const pageState = this.state.pageState;
    if (messageBus.get(TOGGLE_INVENTORY_MSG) && pageState === PAGE_STATE.GAME) {
      this.setState({ pageState: PAGE_STATE.INVENTORY });
    } else if (
      (messageBus.get(TOGGLE_INVENTORY_MSG) || messageBus.get(CLOSE_INVENTORY_MSG)) &&
      pageState === PAGE_STATE.INVENTORY
    ) {
      this.setState({ pageState: PAGE_STATE.GAME });
    }
  }

  onPlayerUpdate(gameObject) {
    if (!gameObject) {
      this.setState({
        health: 0,
      });
      return;
    }

    const health = gameObject.getComponent(HEALTH_COMPONENT_NAME);

    const newState = {};

    if (health.points !== this.state.health) {
      newState.health = health.points;
    }

    const gameObjectId = gameObject.getId();

    if (gameObjectId !== this.state.gameObjectId) {
      newState.gameObjectId = gameObjectId;
      newState.gameObject = gameObject;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
    }

    if (this.state.movementDirection == null || this.state.movementDirection === undefined) {
      return;
    }

    this.props.pushMessage({
      type: MOVEMENT_MSG,
      directionAngle: this.state.movementDirection,
      id: this.state.gameObjectId,
      gameObject: this.state.gameObject,
    });
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
      name: GAME_SCENE_NAME,
    });
  }

  onMainMenu() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      name: MAIN_MENU_SCENE_NAME,
    });
  }

  onPlayerMove = (x, y) => {
    const movementDirection = (x || y)
      ? MathOps.radToDeg(MathOps.getAngleBetweenTwoPoints(x, 0, y, 0))
      : null;

    this.setState({ movementDirection });
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
    return (
      <>
        <header className='game__header'>
          <HealthBar health={this.state.health}/>
          <ActionBar
            onClick={this.onInventoryToggle}
            keyName='I'
            title='Inventory'
          />
        </header>
        <footer className='game__footer'>
          <div className='game__bars'>
            <ItemsBar
              user={this.state.gameObject}
            />
            {this.renderActionBar()}
          </div>
          {this.isTouchDevice && (
            <ThumbStick
              className='game__thumb-stick'
              player={this.state.gameObject}
              onMove={this.onPlayerMove}
            />
          )}
        </footer>
      </>
    );
  }

  render() {
    return (
      <div className='game'>
        {this.renderStateStrategy[this.state.pageState]()}
      </div>
    );
  }
}

Game.propTypes = {
  messageBusObserver: PropTypes.any,
  storeObserver: PropTypes.any,
  pushMessage: PropTypes.func,
  gameObjects: PropTypes.any,
};

export default withGame(Game);
