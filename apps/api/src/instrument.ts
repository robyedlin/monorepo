// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from '@sentry/node'

import {
    SENTRY_DSN_URL
} from './env'

Sentry.init({
  dsn: SENTRY_DSN_URL,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  enabled: process.env.NODE_ENV !== 'development',
  sendDefaultPii: true
})