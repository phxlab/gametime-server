import id from './id';

process.env.TZ = 'America/Los_Angeles';

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(0, 0, 0, 0);
yesterday.toISOString();

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);
tomorrow.toISOString();

const inTwoDays = new Date();
inTwoDays.setDate(inTwoDays.getDate() + 2);
inTwoDays.setHours(0, 0, 0, 0);
inTwoDays.toISOString();

const twoDaysAgo = new Date();
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
twoDaysAgo.setHours(0, 0, 0, 0);
twoDaysAgo.toISOString();

const waves = [
  {
    name: 'Wave 1',
    open: yesterday,
    close: tomorrow,
    store: id.store.thsFootball,
  },
  {
    name: 'Closed',
    open: twoDaysAgo,
    close: yesterday,
    store: id.store.closed,
  },
  {
    name: 'Not Open Yet',
    open: tomorrow,
    close: inTwoDays,
    store: id.store.notOpen,
  },
];

export default waves;
