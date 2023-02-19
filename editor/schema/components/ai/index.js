export const ai = {
  title: 'components.ai.title',
  fields: [
    {
      name: 'strategy',
      title: 'components.ai.strategy.title',
      type: 'select',
      referenceId: 'strategies',
    },
  ],
  // TODO: Custom view. Move ai scripts out from system like it was for effects and get references list dynamically
  references: {
    strategies: {
      items: [
        {
          title: 'components.ai.strategies.enemy.title',
          value: 'enemy',
        },
        {
          title: 'components.ai.strategies.rangeEnemy.title',
          value: 'rangeEnemy',
        },
      ],
    },
  },
  getInitialState: () => ({
    strategy: 'enemy',
  }),
};
