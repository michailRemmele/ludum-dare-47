export const player = {
  fields: [
    {
      name: 'options.skyId',
      title: 'scripts.scriptSystem.options.skyId.title',
      type: 'string',
    },
    {
      name: 'options.threshold',
      title: 'scripts.scriptSystem.options.threshold.title',
      type: 'number',
    },
  ],
  getInitial: () => ({
    skyId: '',
    threshold: 0,
  }),
};
