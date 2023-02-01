import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Widget,
  useConfig,
} from 'remiz-editor';

const SCENE_PATH_LENGTH = 2;

const getItems = (
  gameObjects,
  parent,
) => gameObjects.reduce((acc, gameObject) => {
  acc.push({
    title: parent ? `${parent.name}.${gameObject.name}` : gameObject.name,
    value: gameObject.id,
  });

  if (gameObject.children?.length) {
    acc.push(...getItems(gameObject.children, gameObject));
  }

  return acc;
}, []);

export const DayNightSimulatorWidget = ({ fields, path, references }) => {
  const scene = useConfig(path.slice(0, SCENE_PATH_LENGTH));
  const level = useConfig(
    typeof scene.level === 'string' ? [ 'levels', `name:${scene.level}` ] : void 0
  );
  const gameObjects = level?.gameObjects || [];

  const items = useMemo(() => getItems(gameObjects), [ gameObjects ]);

  const extReferences = useMemo(() => ({
    ...references,
    gameObjects: {
      items,
    },
  }), [ references ]);

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  );
};

DayNightSimulatorWidget.propTypes = {
  fields: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.string),
  references: PropTypes.object,
};
