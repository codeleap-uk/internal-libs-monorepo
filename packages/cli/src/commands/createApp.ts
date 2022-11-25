// import { waitFor } from '@codeleap/common'
import { codeleapCommand } from '../lib/Command'
import { createMobileApp, inquirer } from '../lib'
import '../lib/firebase'
const commandName = 'create'

export const createAppCommand = codeleapCommand(
  {
    name: commandName,
    parameters: [
      '[name]',
    ],
    help: {
      description: 'Initialize a web or mobile app in the codeleap style',
      examples: [
        `codeleap ${commandName} myAppName`,
      ],
    },
    flags: {
      initFirebase: {
        type: Boolean,
        default: true,
      },
    },

  },
  async (argv) => {
    const { flags, _ } = argv
    const appName = _.name

    const answer = await inquirer.prompt({
      name: 'Platform',
      message: `Where is this app going to run?`,
      type: 'list',
      choices: [
        'Mobile',
        'Web',
      ],
    })

    if (answer.Platform === 'Web') {

    } else if (answer.Platform === 'Mobile') {
      createMobileApp({
        name: appName,
      })
    }
  },
)
