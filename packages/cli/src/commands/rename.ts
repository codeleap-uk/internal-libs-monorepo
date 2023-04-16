
import { codeleapCommand } from '../lib/Command'

import { spinWhileNotCompleted } from '../lib/spinner'
import fs from 'fs'
import path from 'path'
import dive from 'dive'
import { chalk, inquirer, figlet, getAndroidBundleId, walkDir, getAndroidAppName, renameAndroid } from '../lib'
import { renameIos } from '../lib/ios'
import '../lib/firebase'
import { cwd } from '../constants'
const commandName = 'rename-mobile'

export const renameMobileCommand = codeleapCommand(
  {
    name: commandName,
    parameters: [
      '[new_name]',
    ],
    help: {
      description: 'Command for easily renaming ios and/or android app names consistently',
      examples: [
        `codeleap ${commandName} myAppName --ios # renames only ios folder`,
        `codeleap ${commandName} myAppName --android # renames only android folder`,
        `codeleap ${commandName} myAppName --android --ios # renames both folders`,
        `codeleap ${commandName} myAppName --android --ios # Will show the diff in "previous -> new" format`,
      ],
    },

    flags: {
      ios: {
        type: Boolean,
        description: 'Enables renaming of ios folder contents',

      },
      android: {
        type: Boolean,
        description: 'Enables renaming of android folder contents',

      },
      dry: {
        type: Boolean,
        description: 'Will not alter anything, only show the difference',
      },
      displayOnly: {
        type: Boolean,
        description: 'Will not alter the bundle identifier',
      },
    },

  },
  async (argv) => {
    const { flags, _ } = argv
    let name = _.newName

    if (!name) {
      const answers = await inquirer.prompt([
        {
          message: `Please insert the new name.`,
          name: 'name',
        },
      ])
      name = answers.name
    }

    if (flags.android) {
      const androidFolder = path.join(cwd, 'android')
      spinWhileNotCompleted(
        async () => {
          await renameAndroid(
            androidFolder,
            name,
            {
              changeBundle: !flags.displayOnly,
            },
          )
        },
        {
          name: 'Renaming android...',
        },
      )

    }

    if (flags.ios) {
      const iosFolder = path.join(cwd, 'ios')
      spinWhileNotCompleted(
        async () => {
          await renameIos(
            iosFolder,
            name,
            {
              changeBundle: !flags.displayOnly,
            },
          )
        },
        {
          name: 'Renaming iOS...',
        },
      )
    }
    const appJsonPath = path.join(cwd, 'app.json')
    const appJson = JSON.parse(fs.readFileSync(appJsonPath).toString())
    fs.writeFileSync(
      appJsonPath,
      JSON.stringify({
        ...appJson,
        name,
      }),
    )
  },
)
