export const health = {
  title: 'components.health.title',
  fields: [
    {
      name: 'points',
      title: 'components.health.points.title',
      type: 'number',
    },
  ],
  getInitial: () => ({
    points: 1,
  }),
};
