#!/usr/bin/env node
import { cli } from 'cleye'
import { initCommand } from './commands/init'
import { renameMobileCommand } from './commands/rename'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('../package.json')

cli({
  name: 'codeleap',
  commands: [initCommand, renameMobileCommand],
  version: packageJson.version,
})

export {}
