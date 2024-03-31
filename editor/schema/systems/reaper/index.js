import { ReaperWidget } from './view';

export const reaper = {
  title: 'systems.reaper.title',
  fields: [
    {
      name: 'lifetime',
      title: 'systems.reaper.lifetime.title',
      type: 'number',
    },
    {
      name: 'allowedComponents',
      title: 'systems.reaper.allowedComponents.title',
      type: 'multiselect',
      referenceId: 'components',
    },
  ],
  view: ReaperWidget,
  getInitialState: () => ({
    lifetime: 1000,
    allowedComponents: [],
  }),
};
