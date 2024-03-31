import {
  Attack,
  Movement,
  Grab,
  UseItem,
  ToggleInventory,
  CloseInventory,
} from '../../src/events/event-types';

export const controlEventsReference = {
  items: [
    Attack,
    Movement,
    Grab,
    UseItem,
    ToggleInventory,
    CloseInventory,
  ].map((value) => ({ title: value, value })),
};
