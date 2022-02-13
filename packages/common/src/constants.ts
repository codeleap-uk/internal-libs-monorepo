import { Logger } from './tools/Logger'

export const silentLogger = new Logger({
  Logger: {
    Level: 'silent',
    IgnoreWarnings: [
      `Require cycle:`,
      `Require cycles are allowed`,
    ],
  },
})
