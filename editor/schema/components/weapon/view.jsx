import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

export const WeaponWidget = ({
  fields,
  path,
  references,
  components: {
    Widget,
  },
  context: {
    projectConfig,
  },
}) => {
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
  components: PropTypes.shape({
    Widget: PropTypes.element,
  }),
  context: PropTypes.shape({
    projectConfig: PropTypes.object,
  }),
};

