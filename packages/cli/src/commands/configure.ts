// import { waitFor } from '@codeleap/common'
import { codeleapCommand } from '../lib/Command'
import { fs, inquirer } from '../lib'
import '../lib/firebase'
import { cliConfigPath } from '../constants'
import { CodeleapCLIUserConfig } from '../types'
const commandName = 'configure'

const ACCESS_TOKEN_HELP = 'https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token'
const neededPerms = [
  'Create Repo',
].join(', ')

export const configureCommand = codeleapCommand(
  {
    name: commandName,

    help: {
      description: 'Configure profile for codeleap cli',
      examples: [
        `codeleap ${commandName} # Follow the prompts`,
      ],
    },

  },
  async (argv) => {
    const { flags, _ } = argv

    const answers = await inquirer.prompt([
      {
        name: 'username',
        message: 'What is your name?',
      },
      {
        name: 'githubPat',
        message: `Please insert your Github access token. Instructions for getting an access token can be found here ${ACCESS_TOKEN_HELP}.\nRequired permissions are: ${neededPerms}\n`,
      },
    ])
    const options:CodeleapCLIUserConfig = {
      GITHUB_TOKEN: answers.githubPat,
    }

    fs.writeFileSync(cliConfigPath, JSON.stringify(options, null, 2), {
      encoding: 'utf-8',
    })
  },
)
