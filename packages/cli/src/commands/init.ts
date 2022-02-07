import { waitFor } from '@codeleap/common'
import { command } from 'cleye'
import inquirer from 'inquirer'

import { spinWhileNotCompleted } from '../lib/spinner'
import figlet from 'figlet'
import chalk from 'chalk'

export const initCommand =  command({
  name: 'init',
  parameters: ['<projectname>', '<platform>'],
  alias: 'i',
}, async ({_}) => {
  console.log(chalk.blue(figlet.textSync('Codeleap')))

  const answers = await inquirer.prompt([
    {
      message: `What's the development server's url? (Skip if there's not one)`,
      default: '',
      name: 'devServerURL',
    },
  ])

  spinWhileNotCompleted(async () => {
    await waitFor(10000)
  }, {
    name: 'Getting template for platform ' + _.platform,
  })
})

