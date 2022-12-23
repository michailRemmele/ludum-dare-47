import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Widget, SchemasContext } from 'remiz-editor';

export const ReaperWidget = ({ fields, path, references }) => {
  const { t } = useTranslation();

  const { components } = useContext(SchemasContext);

  const items = useMemo(() => components.map((component) => ({
    title: t(`${component.namespace}:${component.schema.title}`),
    value: component.name,
  })), [ components ]);

  const extReferences = useMemo(() => ({
    ...references,
    components: {
      items,
    },
  }), [ references ]);

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  );
};

ReaperWidget.propTypes = {
  fields: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.string),
  references: PropTypes.object,
};
