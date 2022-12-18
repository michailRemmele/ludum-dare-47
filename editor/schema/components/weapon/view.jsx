import React, { useMemo, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  EngineContext,
  Widget,
} from 'remiz-editor';

export const WeaponWidget = ({
  fields,
  path,
  references,
}) => {
  const { sceneContext } = useContext(EngineContext);
  const projectConfig = sceneContext.data.projectConfig;

  const { templates } = projectConfig;

  const extendedReferences = useMemo(() => ({
    ...references,
    models: {
      items: templates.map((template) => ({
        title: template.name,
        value: template.name,
      })),
    },
  }), [ references ]);

  return (
    <Widget path={path} fields={fields} references={extendedReferences} />
  );
};

WeaponWidget.propTypes = {
  fields: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.string),
  references: PropTypes.object,
};

