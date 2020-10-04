import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../atoms/button/Button';

import './style.css';

const CRAFTS = {
  healPotion: {
    name: 'healPotion',
    title: 'Heal Potion',
    mod: 'heal',
    bonuses: [
      'HP: +50',
    ],
    resource: 'healGrass',
    cost: 3,
  },
  powerPotion: {
    name: 'powerPotion',
    title: 'Power Potion',
    mod: 'power',
    bonuses: [
      'Damage: +25',
      'Range: +15',
      'Duration: 5 sec',
    ],
    resource: 'ogreGrass',
    cost: 3,
  },
};

class Inventory extends React.Component {
  renderCraftBonuses(name) {
    return CRAFTS[name].bonuses.map((bonus) => {
      return (
        <p className='craft-card__bonus' key={bonus}>{bonus}</p>
      );
    });
  }

  renderCraftCard(name) {
    const recipe = CRAFTS[name];
    const disabled = this.props[recipe.resource] < recipe.cost;

    return (
      <div className='inventory__craft-card craft-card'>
        <header className='craft-card__header'>
          <h3 className={`craft-card__title craft-card__title_${recipe.mod}`}>
            {recipe.title}
          </h3>
        </header>
        <div className='craft-card__description'>
          {this.renderCraftBonuses(name)}
        </div>
        <div
          className={`craft-card__cost ${disabled ? 'craft-card__cost_disabled' : ''}`}
        >
          Cost:
          <span className={`craft-card__cost-value craft-card__cost-value_${recipe.mod}`}>
            x {recipe.cost}
          </span>
        </div>
        <footer className='craft-card__footer'>
          <Button
            title='Craft'
            onClick={() => this.props.onCraft(recipe)}
            disabled={disabled}
          />
        </footer>
      </div>
    );
  }

  render() {
    return (
      <div className={`inventory ${this.props.className}`}>
        <header className='inventory__header'>
          <h2 className='inventory__title'>Inventory</h2>
          <ul className='inventory__resources resources'>
            <li className='resources__item resources__item_heal'>
              x {this.props.healGrass || 0}
            </li>
            <li className='resources__item resources__item_ogre'>
              x {this.props.ogreGrass || 0}
            </li>
            <li className='resources__item resources__item_boom'>
              x {this.props.boomGrass || 0}
            </li>
          </ul>
        </header>
        <div className='inventory__craft-list'>
          {this.renderCraftCard('healPotion')}
          {this.renderCraftCard('powerPotion')}
        </div>
      </div>
    );
  }
}

Inventory.defaultProps = {
  className: '',
  healGrass: 0,
  ogreGrass: 0,
  boomGrass: 0,
};

Inventory.propTypes = {
  className: PropTypes.string,
  healGrass: PropTypes.number,
  ogreGrass: PropTypes.number,
  boomGrass: PropTypes.number,
  onCraft: PropTypes.func,
};

export default Inventory;
