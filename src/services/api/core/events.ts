// services/api/core/events.ts
import mitt from 'mitt';

export type Events = {
  'loading:start': void;
  'loading:end': void;
};

export const emitter = mitt<Events>();
