import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { useConfig, useCommander, commands } from 'remiz-editor';

import { InputBind } from './input-bind';

import './style.less';

const events = [
  {
    title: 'components.thumbStickControl.option.positionChange.title',
    value: 'THUMB_STICK_POSITION_CHANGE',
  },
];

export const ThumbStickControlWidget = ({ path }) => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [ path ]);

  const inputEventBindings = useConfig(bindingsPath);

  const options = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), []);
  const optionsMap = useMemo(() => options.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {}), [ options ]);
  const bindingsMap = useMemo(
    () => inputEventBindings.reduce((acc, { event, ...bind }) => {
      acc[event] = bind;
      return acc;
    }, {}),
    [ inputEventBindings ],
  );
  const availableOptions = useMemo(
    () => options.filter((event) => !bindingsMap[event.value]),
    [ options, bindingsMap ]
  );
  const addedOptions = useMemo(
    () => inputEventBindings.map((bind) => optionsMap[bind.event]),
    [ inputEventBindings, optionsMap ]
  );

  const handleAddNewBind = useCallback(() => {
    const inputEvent = availableOptions[0].value;
    dispatch(commands.addValue(bindingsPath, { event: inputEvent, messageType: '', attrs: []}));
  }, [ dispatch, bindingsPath, availableOptions ]);

  return (
    <div>
      <ul className='thumb-stick-control__events'>
        {addedOptions.map((event, index) => (
          <li className='thumb-stick-control__fieldset' key={event.value}>
            <InputBind
              path={path}
              event={event}
              order={index}
              availableEvents={availableOptions}
            />
          </li>
        ))}
      </ul>
      <Button
        className='thumb-stick-control__button'
        size='small'
        onClick={handleAddNewBind}
        disabled={availableOptions.length === 0}
      >
        {t('components.thumbStickControl.bind.addNew.title')}
      </Button>
    </div>
  );
};

ThumbStickControlWidget.propTypes = {
  fields: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.string),
  references: PropTypes.object,
};

