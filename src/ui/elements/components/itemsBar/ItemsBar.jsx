import React from 'react';
import PropTypes from 'prop-types';

import withGame from '../../hocs/withGame/withGame';

import ActionBar from '../actionBar/ActionBar';

import './style.css';

const ITEMS = {
  healPotion: {
    name: 'Heal Potion',
    key: 'R',
    iconSrc: '/images/heal-potion.png',
  },
  powerPotion: {
    name: 'Power Potion',
    key: 'Q',
    iconSrc: '/images/power-potion.png',
  },
};

const INVENTORY_KEY = 'inventory';
const USE_ITEM_MSG = 'USE_ITEM';

class ItemsBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.storeSubscription = this.onStoreUpdate.bind(this);
  }

  componentDidMount() {
    this.props.storeObserver.subscribe(this.storeSubscription);
  }

  componentWillUnmount() {
    this.props.storeObserver.unsubscribe(this.storeSubscription);
  }


  onStoreUpdate(store) {
    const { healPotion, powerPotion } = store.get(INVENTORY_KEY);

    if (healPotion !== this.state.healPotion || powerPotion !== this.state.powerPotion) {
      this.setState({
        healPotion,
        powerPotion,
      });
    }
  }

  onUseItem(event, item) {
    event.stopPropagation();

    this.props.pushMessage({
      type: USE_ITEM_MSG,
      id: this.props.user.getId(),
      gameObject: this.props.user,
      item,
    });
  }

  renderItem(name) {
    if (!this.state[name]) {
      return;
    }

    return (
      <li className='items-bar__item' key={name}>
        <ActionBar
          className='items-bar__action-bar'
          onClick={(event) => this.onUseItem(event, name)}
          keyName={ITEMS[name].key}
          title={`x ${this.state[name]}`}
          iconSrc={ITEMS[name].iconSrc}
          iconDescr={ITEMS[name].name}
          size='sm'
        />
      </li>
    );
  }

  renderItems() {
    return Object.keys(ITEMS).reduce((storage, name) => {
      const item = this.renderItem(name);

      if (!item) {
        return storage;
      }

      storage.push(item);

      return storage;
    }, []);
  }

  render() {
    return (
      <ul className={`items-bar ${this.props.className}`}>
        {this.renderItems()}
      </ul>
    );
  }
}

ItemsBar.defaultProps = {
  className: '',
};

ItemsBar.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  storeObserver: PropTypes.any,
  pushMessage: PropTypes.func,
};

export default withGame(ItemsBar);
