import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const EFFECTS_SYSTEM_NAME = 'effectsSystem';

export const EffectWidget = ({
  fields,
  path,
  references,
  components: {
    Widget,
  },
  context: {
    extension,
    projectConfig,
  },
  utils: {
    get,
  },
}) => {
  const { scripts, scriptsSchema } = extension;

  const scriptName = useMemo(() => get(projectConfig, path.concat('action')), [ projectConfig ]);

  const extendedReferences = useMemo(() => ({
    ...references,
    actions: {
      items: Object.keys(scripts[EFFECTS_SYSTEM_NAME] || {}).map((key) => ({
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
  components: PropTypes.shape({
    Widget: PropTypes.element,
  }),
  context: PropTypes.shape({
    extension: PropTypes.object,
    projectConfig: PropTypes.object,
  }),
  utils: PropTypes.shape({
    get: PropTypes.func,
  }),
};

