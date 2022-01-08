import * as Sentry from '@sentry/browser';
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn: 'https://0526af5e7b5f4c05bc03d004ecd547e2@o3491.ingest.sentry.io/6139678',
  integrations: [new Integrations.BrowserTracing()],
});
