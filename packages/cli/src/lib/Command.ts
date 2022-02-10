import { command } from 'cleye'
import figlet from 'figlet'
import chalk from 'chalk'

export const codeleapCommand: typeof command = (opts, callback) => {
  return command(opts, async (...args) => {
    console.log(chalk.blue(figlet.textSync('Codeleap')))
    return await callback(...args)
  })
}
