import { command } from 'cleye'
import figlet from 'figlet'
import chalk from 'chalk'
import { fs } from './utils'
import { cliConfigPath } from '../constants'

export const codeleapCommand: typeof command = (opts, callback) => {
  return command(opts, async (...args) => {
    console.log(chalk.blue(figlet.textSync('Codeleap')))

    if (opts.name !== 'configure' && !fs.existsSync(cliConfigPath)) {
      throw new Error(`Could not find a configuration file at ${cliConfigPath}. Please run 'codeleap configure' to start setup`)
    }

    return await callback(...args)
  })
}
