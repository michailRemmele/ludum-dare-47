import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Widget,
  useExtension,
  useConfig,
} from 'remiz-editor';

const EFFECTS_SYSTEM_NAME = 'effectsSystem';

export const EffectWidget = ({
  fields,
  path,
  references,
}) => {
  const { scriptsSchema } = useExtension();

  const actionPath = useMemo(() => path.concat('action'), [ path ]);

  const scriptName = useConfig(actionPath);

  const extendedReferences = useMemo(() => ({
    ...references,
    actions: {
      items: Object.keys(scriptsSchema[EFFECTS_SYSTEM_NAME] || {}).map((key) => ({
        title: key,
        value: key,
      })),
    },
  }), [ references ]);

  const partFields = scriptsSchema[EFFECTS_SYSTEM_NAME]?.[scriptName]?.fields;
  const partReferences = scriptsSchema[EFFECTS_SYSTEM_NAME]?.[scriptName]?.references;

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

