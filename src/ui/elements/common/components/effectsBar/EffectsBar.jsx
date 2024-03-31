import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ActiveEffects, Effect, UI } from '../../../../../game/components';
import { withGame } from '../../../common';
import { PLAYER_ID } from '../../../../../consts/actors';

import './style.css';

export const EffectsBar = ({
  className,
  scene,
  gameStateObserver,
}) => {
  const [ effects, setEffects ] = useState([]);

  useEffect(() => {
    const handleGameStateUpdate = () => {
      const actor = scene.getEntityById(PLAYER_ID);

      if (!actor || !actor.getComponent(ActiveEffects)) {
        return;
      }

      const activeEffects = actor.getComponent(ActiveEffects);

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

    gameStateObserver.subscribe(handleGameStateUpdate);

    return () => gameStateObserver.unsubscribe(handleGameStateUpdate);
  }, [ effects, scene, gameStateObserver ]);

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
  gameStateObserver: void 0,
  scene: void 0,
};

EffectsBar.propTypes = {
  className: PropTypes.string,
  gameStateObserver: PropTypes.any,
  scene: PropTypes.any,
};

export const EffectsBarWithGame = withGame(EffectsBar);
