#!/usr/bin/env node
import { cli } from 'cleye'
import { configureCommand } from './commands/configure'
import { createAppCommand } from './commands/createApp'
import { downloadKeystores } from './commands/downloadKeystores'
import { generateReleaseKey } from './commands/keystoresAndroid'
import { renameMobileCommand } from './commands/rename'
import { logger, LogLevel, LogLevels,  } from './lib/log'


const packageJson = require('../package.json')



cli({
  name: 'codeleap',
  commands: [
    generateReleaseKey, 
    renameMobileCommand, 
    createAppCommand, 
    configureCommand,
    downloadKeystores
  ],
  version: packageJson.version,
  flags: {
    logs: {
      type: LogLevel,
      default: 'info' as LogLevels,
      description: 'Set the log level. Options: error, warning, info, verbose',
    }
  },
}, (a) => {
  logger.setLevel(a.flags.logs)
})

export {}
