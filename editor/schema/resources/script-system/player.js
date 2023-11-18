export const player = {
  fields: [
    {
      name: 'options.skyId',
      title: 'resources.scriptSystem.options.skyId.title',
      type: 'string',
    },
    {
      name: 'options.threshold',
      title: 'resources.scriptSystem.options.threshold.title',
      type: 'number',
    },
  ],
  getInitialState: () => ({
    skyId: '',
    threshold: 0,
  }),
};
