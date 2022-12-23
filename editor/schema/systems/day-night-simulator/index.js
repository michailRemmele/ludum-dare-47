import { DayNightSimulatorWidget } from './view';

export const dayNightSimulator = {
  title: 'systems.dayNightSimulator.title',
  fields: [
    {
      name: 'dayLength',
      title: 'systems.dayNightSimulator.dayLength.title',
      type: 'number',
    },
    {
      name: 'startTime',
      title: 'systems.dayNightSimulator.startTime.title',
      type: 'number',
    },
    {
      name: 'skyId',
      title: 'systems.dayNightSimulator.skyId.title',
      type: 'select',
      referenceId: 'gameObjects',
    },
  ],
  view: DayNightSimulatorWidget,
};
