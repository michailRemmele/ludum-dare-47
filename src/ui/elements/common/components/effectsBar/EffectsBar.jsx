import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ActiveEffects, Effect, UI } from '../../../../../game/components';
import { withGame } from '../../../common';
import { PLAYER_ID } from '../../../../consts';

import './style.css';

export const EffectsBar = ({ className, gameObjects }) => {
  const [ effects, setEffects ] = useState([]);

  useEffect(() => {
    const handlePlayerUpdate = (gameObject) => {
      if (!gameObject || !gameObject.getComponent(ActiveEffects)) {
        return;
      }

      const activeEffects = gameObject.getComponent(ActiveEffects);

      const newEffects = activeEffects.list.reduce((acc, effectName) => {
        const effectObject = activeEffects.map[effectName];

        const effect = effectObject.getComponent(Effect);
        const ui = effectObject.getComponent(UI);

        if (effect && ui) {
          acc.push({
            name: effectName,
            iconSrc: ui.icon,
            title: ui.title,
            duration: Math.round(effect.applicatorOptions.duration / 1000),
          });
        }

        return acc;
      }, []);

      const shouldUpdate = newEffects.length !== effects.length || newEffects.some(
        (newEffect, index) =>
          newEffect.iconSrc !== effects[index].iconSrc ||
          newEffect.title !== effects[index].title ||
          newEffect.duration !== effects[index].duration
      );

      if (shouldUpdate) {
        setEffects(newEffects);
      }
    };

    gameObjects.subscribe(handlePlayerUpdate, PLAYER_ID);

    return () => gameObjects.unsubscribe(handlePlayerUpdate, PLAYER_ID);
  }, [ effects ]);

  if (!effects.length) {
    return null;
  }

  return (
    <ul
      className={`effects-bar ${className}`}
    >
      {effects.map((effect) => (
        <li className='effects-bar__item' key={effect.name}>
          <img className='effects-bar__icon' src={effect.iconSrc} alt={effect.title} />
          <span className='effects-bar__title'>{`${effect.duration} sec.`}</span>
        </li>
      ))}
    </ul>
  );
};

EffectsBar.defaultProps = {
  className: '',
  gameObjects: void 0,
};

EffectsBar.propTypes = {
  className: PropTypes.string,
  gameObjects: PropTypes.any,
};

export const EffectsBarWithGame = withGame(EffectsBar);
