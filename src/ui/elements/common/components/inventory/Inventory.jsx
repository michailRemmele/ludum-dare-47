import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../button';

import './style.css';

const ROOT_CLASS_NAME = 'inventory';

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

const CRAFT_RECIPES = [
  {
    name: 'healPotion',
    title: 'Heal Potion',
    mod: 'heal',
    bonuses: [
      'HP: +50',
    ],
    resource: 'healGrass',
    cost: 3,
  },
  {
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
];

export const Inventory = ({
  className,
  healGrass,
  ogreGrass,
  boomGrass,
  onCraft,
  onLeave,
}) => {
  const [ selectedRecipe, setSelectedRecipe ] = useState(CRAFT_RECIPES[0].name);

  useEffect(() => {
    window.addEventListener('click', onWindowClick);

    return () => window.removeEventListener('click', onWindowClick);
  }, []);

  const onWindowClick = (event) => {
    if (!event.target.closest(`.${ROOT_CLASS_NAME}`)) {
      onLeave();
    }
  };

  const renderCraftBonuses = (name) => {
    return CRAFTS[name].bonuses.map((bonus) => {
      return (
        <p className='craft-card__bonus' key={bonus}>{bonus}</p>
      );
    });
  };

  const renderCraftCard = (name) => {
    const resources = { healGrass, ogreGrass, boomGrass };

    const recipe = CRAFTS[name];
    const disabled = resources[recipe.resource] < recipe.cost;

    return (
      <div className='inventory__craft-card craft-card'>
        <header className='craft-card__header'>
          <h3 className={`craft-card__title craft-card__title_${recipe.mod}`}>
            {recipe.title}
          </h3>
        </header>
        <div className='craft-card__description'>
          {renderCraftBonuses(name)}
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
            className='craft-card__button'
            title='Craft'
            onClick={() => onCraft(recipe)}
            disabled={disabled}
          />
        </footer>
      </div>
    );
  };

  return (
    <div className={`${ROOT_CLASS_NAME} ${className}`}>
      <header className='inventory__header'>
        <div className='inventory__heading'>
          <h2 className='inventory__title'>Inventory</h2>
          <ul className='inventory__resources resources'>
            <li className='resources__item resources__item_heal'>
              x {healGrass || 0}
            </li>
            <li className='resources__item resources__item_ogre'>
              x {ogreGrass || 0}
            </li>
            <li className='resources__item resources__item_boom'>
              x {boomGrass || 0}
            </li>
          </ul>
        </div>
        <Button
          className='inventory__close-button'
          title='x'
          onClick={onLeave}
        />
      </header>
      <div className='inventory__content'>
        <ul className='inventory__recipes recipes'>
          {CRAFT_RECIPES.map((recipe) => (
            <li
              key={recipe.name}
              className={
                `recipes__item${selectedRecipe === recipe.name ? ' recipes__item_selected' : ''}`
              }
              onClick={() => setSelectedRecipe(recipe.name)}
            >
              {recipe.title}
            </li>
          ))}
        </ul>
        {renderCraftCard(selectedRecipe)}
      </div>
    </div>
  );
};

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
  onLeave: PropTypes.func,
};
