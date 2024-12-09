import { Logger } from '@codeleap/logger'

export const logger = new Logger({
  Environment: {
    IsDev: true,
  },
  Sentry: {
    enable: false,
  },
  Logger: {
    Level: 'debug',
  },
})
