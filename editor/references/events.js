import * as EventType from 'remiz/events';

import * as GameEventType from '../../src/events/event-types';

export const eventsReference = {
  items: [
    ...Object.values(GameEventType),
    ...Object.values(EventType),
  ].map((value) => ({ title: value, value })),
};
