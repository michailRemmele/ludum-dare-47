import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Widget,
  useExtension,
  useConfig,
} from 'remiz-editor';

import { EffectsSystem } from '../../../../src/game/systems';

export const EffectWidget = ({
  fields,
  path,
  references,
}) => {
  const { resourcesSchema } = useExtension();

  const actionPath = useMemo(() => path.concat('action'), [ path ]);

  const scriptName = useConfig(actionPath);

  const extendedReferences = useMemo(() => ({
    ...references,
    actions: {
      items: Object.keys(resourcesSchema[EffectsSystem.systemName] || {}).map((key) => ({
        title: key,
        value: key,
      })),
    },
  }), [ references ]);

  const partFields = resourcesSchema[EffectsSystem.systemName]?.[scriptName]?.fields;
  const partReferences = resourcesSchema[EffectsSystem.systemName]?.[scriptName]?.references;

  return (
    <>
      <Widget path={path} fields={fields} references={extendedReferences} />
      <Widget path={path} fields={partFields} references={partReferences} />
    </>
  );
};

EffectWidget.propTypes = {
  fields: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.string),
  references: PropTypes.object,
};

