#!/usr/bin/env node
import { cli } from 'cleye'
import { configureCommand } from './commands/configure'
import { createAppCommand } from './commands/createApp'
import { downloadKeystores } from './commands/downloadKeystores'
import { generateReleaseKey } from './commands/keystoresAndroid'
import { renameMobileCommand } from './commands/rename'
import { syncIconsCommand } from './commands/syncIcons'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json')

cli({
  name: 'codeleap',
  commands: [
    generateReleaseKey, 
    renameMobileCommand, 
    createAppCommand, 
    configureCommand,
    downloadKeystores,
    syncIconsCommand
  ],
  version: packageJson.version,

})

export {}
