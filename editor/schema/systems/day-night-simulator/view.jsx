import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Widget,
  EngineContext,
  get,
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
  const { sceneContext } = useContext(EngineContext);
  const projectConfig = sceneContext.data.projectConfig;

  const items = useMemo(() => {
    const scene = get(projectConfig, path.slice(0, SCENE_PATH_LENGTH));

    if (typeof scene.level !== 'string') {
      return [];
    }

    const { gameObjects } = get(projectConfig, [ 'levels', scene.level ]);

    return getItems(gameObjects);
  }, [ projectConfig, path ]);

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
