import React, { useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import {
  EngineContext,
  Field,
  LabelledSelect,
  LabelledTextInput,
  MultiField,
  Panel,
  get,
} from 'remiz-editor';

import './style.less';

const events = [
  {
    title: 'components.thumbStickControl.option.positionChange.title',
    value: 'THUMB_STICK_POSITION_CHANGE',
  },
];

export const ThumbStickControlWidget = ({ path }) => {
  const { t } = useTranslation();

  const { sceneContext } = useContext(EngineContext);
  const projectConfig = sceneContext.data.projectConfig;

  const options = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), []);
  const inputEventBindings = useMemo(
    () => get(projectConfig, path.concat('inputEventBindings')),
    [ projectConfig ]
  );
  const availableOptions = useMemo(
    () => options.filter((event) => !inputEventBindings[event.value]),
    [ inputEventBindings ]
  );
  const addedOptions = useMemo(
    () => options.filter((event) => inputEventBindings[event.value]),
    [ inputEventBindings ]
  );

  const handleChange = useCallback(() => {
    // TODO: Обрабатывать изменение маппинга на другой эвент
    // Нужно в конфиге по новому ключу сохранить текущий маппинг, а старую запись удалить
    // После этого списки выбранных и доступных опций должны автоматом обновиться
  }, []);
  const handleAddNewBind = useCallback(() => {
    // TODO: Нужно из доступных брать первый эвент и добавлять новую секцию для этого эвента
  }, []);
  const handleDeleteBind = useCallback(() => {
    // TODO: Нужно удалить по ключу один из биндов
  }, []);

  return (
    <div>
      <ul className='thumb-stick-control__events'>
        {addedOptions.map((event, index) => (
          <li className='thumb-stick-control__fieldset' key={event.value}>
            <Panel
              className='thumb-stick-control__panel'
              title={t('components.thumbStickControl.bind.title', { index: index + 1 })}
              onDelete={handleDeleteBind}
            >
              <LabelledSelect
                // TODO: мемоизировать
                options={[ event, ...availableOptions ]}
                value={event.value}
                onChange={handleChange}
                label={t('components.thumbStickControl.bind.event.title')}
              />
              <Field
                path={path.concat('inputEventBindings', event.value, 'messageType')}
                component={LabelledTextInput}
                label={t('components.thumbStickControl.bind.messageType.title')}
              />
              <span className='thumb-stick-control__section-header'>
                {t('components.thumbStickControl.bind.attributes.title')}
              </span>
              <MultiField
                path={path.concat('inputEventBindings', event.value, 'attrs')}
              />
            </Panel>
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

