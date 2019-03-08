import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://024bc68997b346cca9b819bf59a73955@sentry.io/276228',
  environment: 'server',
});
