import { Logger } from './tools/Logger'

export const silentLogger = new Logger({
  Logger: {
    Level: 'silent',
  },
})
