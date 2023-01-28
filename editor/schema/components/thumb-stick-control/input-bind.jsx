import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  Field,
  LabelledSelect,
  LabelledTextInput,
  MultiField,
  Panel,
  useCommander,
  commands,
} from 'remiz-editor';

export const InputBind = ({
  path,
  event,
  order,
  availableEvents,
}) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `event:${event.value}`), [ path, event ]
  );
  const eventPath = useMemo(() => bindPath.concat('event'), [ bindPath ]);
  const messageTypePath = useMemo(() => bindPath.concat('messageType'), [ bindPath ]);
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [ bindPath ]);

  const inputEvents = useMemo(() => [ event, ...availableEvents ], [ availableEvents ]);

  const handleDeleteBind = useCallback(() => {
    dispatch(commands.deleteValue(bindPath));
  }, [ dispatch, bindPath ]);

  return (
    <Panel
      className='thumb-stick-control__panel'
      title={t('components.thumbStickControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <Field
        path={eventPath}
        component={LabelledSelect}
        label={t('components.thumbStickControl.bind.event.title')}
        options={inputEvents}
      />
      <Field
        path={messageTypePath}
        component={LabelledTextInput}
        label={t('components.thumbStickControl.bind.messageType.title')}
      />
      <span className='thumb-stick-control__section-header'>
        {t('components.thumbStickControl.bind.attributes.title')}
      </span>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  );
};

InputBind.propTypes = {
  path: PropTypes.arrayOf(PropTypes.string),
  event: PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.string,
  }),
  order: PropTypes.number,
  availableEvents: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    value: PropTypes.string,
  })),
};
