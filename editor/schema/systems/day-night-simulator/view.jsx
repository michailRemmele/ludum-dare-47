import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Widget,
  useConfig,
} from 'remiz-editor';

const SCENE_PATH_LENGTH = 2;

const getItems = (
  actors,
  parent,
) => actors.reduce((acc, actor) => {
  acc.push({
    title: parent ? `${parent.name}.${actor.name}` : actor.name,
    value: actor.id,
  });

  if (actor.children?.length) {
    acc.push(...getItems(actor.children, actor));
  }

  return acc;
}, []);

export const DayNightSimulatorWidget = ({ fields, path, references }) => {
  const scene = useConfig(path.slice(0, SCENE_PATH_LENGTH));
  const level = useConfig(
    typeof scene.levelId === 'string' ? [ 'levels', `id:${scene.levelId}` ] : void 0
  );
  const actors = level?.actors || [];

  const items = useMemo(() => getItems(actors), [ actors ]);

  const extReferences = useMemo(() => ({
    ...references,
    actors: {
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
