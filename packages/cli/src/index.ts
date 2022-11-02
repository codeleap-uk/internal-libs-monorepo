#!/usr/bin/env node
import { cli } from 'cleye'
import { generateReleaseKey } from './commands/keystoresAndroid'
import { renameMobileCommand } from './commands/rename'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json')

cli({
  name: 'codeleap',
  commands: [generateReleaseKey, renameMobileCommand],
  version: packageJson.version,
})

export {}
