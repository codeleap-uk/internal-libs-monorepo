import { cli } from 'cleye'
import { initCommand } from './commands/init'

cli({
  name: 'codeleap',
  commands: [
    initCommand,
  ],
})


export {}
