import { command } from 'cleye'
import figlet from 'figlet'
import chalk from 'chalk'
import { fs } from './utils'
import { cliConfigPath } from '../constants'
import { logger, LogLevel, LogLevels } from './log'

export const codeleapCommand: typeof command = (opts, callback) => {

  if(!opts.flags) opts.flags = {}
  
  // @ts-ignore
  opts.flags.logs = {
    type: LogLevel,
    default: 'info' as LogLevels,
    description: 'Set the log level. Options: error, warning, info, verbose',
  }




  return command(opts, async (...args) => {
    logger.setLevel(args[0].flags.logs)
    console.log(chalk.blue(figlet.textSync('Codeleap')))

    if (opts.name !== 'configure' && !fs.existsSync(cliConfigPath)) {
      throw new Error(`Could not find a configuration file at ${cliConfigPath}. Please run 'codeleap configure' to start setup`)
    }
    try {
      const res = await callback(...args)
      return res
    }catch(e){
      logger.error(e)
    }

    return 
  })
}
