export const effect = {
  title: 'components.effect.title',
  fields: [
    {
      name: 'action',
      title: 'components.effect.action.title',
      type: 'select',
      referenceId: 'actions',
    },
    {
      name: 'type',
      title: 'components.effect.type.title',
      type: 'select',
      referenceId: 'types',
    },
    {
      name: 'applicatorOptions.timer',
      title: 'components.applicatorOptions.timer.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'delayed',
      },
    },
    {
      name: 'applicatorOptions.frequency',
      title: 'components.applicatorOptions.frequency.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical',
      },
    },
    {
      name: 'applicatorOptions.duration',
      title: 'components.applicatorOptions.duration.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical|timeLimited',
      },
    },
    {
      name: 'applicatorOptions.cooldown',
      title: 'components.applicatorOptions.cooldown.title',
      type: 'number',
      dependency: {
        name: 'type',
        value: 'periodical',
      },
    },
    // TODO: Custom view. Implement custom view with options fields
  ],
  references: {
    actions: {
      // TODO: Custom view. Get available effects list dynamically
      items: [
        {
          title: 'components.effect.actions.damage.title',
          value: 'damage',
        },
        {
          title: 'components.effect.actions.fetter.title',
          value: 'fetter',
        },
        {
          title: 'components.effect.actions.heal.title',
          value: 'heal',
        },
        {
          title: 'components.effect.actions.power.title',
          value: 'power',
        },
      ],
    },
    types: {
      items: [
        {
          title: 'components.effect.types.instant.title',
          value: 'instant',
        },
        {
          title: 'components.effect.types.delayed.title',
          value: 'delayed',
        },
        {
          title: 'components.effect.types.periodical.title',
          value: 'periodical',
        },
        {
          title: 'components.effect.types.continuous.title',
          value: 'continuous',
        },
        {
          title: 'components.effect.types.timeLimited.title',
          value: 'timeLimited',
        },
      ],
    },
  },
};
