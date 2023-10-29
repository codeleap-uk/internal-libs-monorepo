import { Codepush, alterCliSettings, getCliSettings, getDefaultBranchName, formatError } from '../lib'
import { codeleapCommand } from '../lib/Command'

const commandName = 'codepush-bootstrap'

export const codepushBootstrap = codeleapCommand(
  {
    name: commandName,
    parameters: [
      '<apiToken>',
    ],
    help: {
      description: 'Create a codepush app for iOS and Android, along with necessary tokens. To get the apiToken, go to https://appcenter.ms/settings/',
      examples: [
        `codeleap ${commandName} <apiToken>`,
      ],

    },

  },
  async (argv) => {
    const apiToken = argv._[0]
    const settings = getCliSettings()

    const hasAppConfig = !!settings.codepush.android || !!settings.codepush.ios

    if (hasAppConfig) {
      console.log([
        'You already have codepush apps configured',
        'If you want to create new ones, please apply the following changes to codeleapcli.config.json:',
        '1. Remove codepush.ios and codepush.android keys',
        '2. Change codepush.ApplicationName to a new value',
        '3. Run this command again',
      ].join('\n'))
      return
    }
    const defaultBranchName = await getDefaultBranchName()

    console.log('Creating applications...')

    try {
      const iosApp = await Codepush.createApplication('ios', apiToken)
      console.log('iOS application created')

      alterCliSettings((currentSettings) => {
        currentSettings.codepush.ios = {
          ApplicationName: iosApp.app.name,
          ApiToken: iosApp.appToken,
        }
        return currentSettings
      })

      await Codepush.createDeployment(defaultBranchName, 'ios')
    } catch (e) {
      console.error('Error creating iOS application', ...formatError(e))
      process.exit(1)
      return
    }

    try {
      const androidApp = await Codepush.createApplication('android', apiToken)
      console.log('Android application created')
      alterCliSettings((currentSettings) => {
        currentSettings.codepush.android = {
          ApplicationName: androidApp.app.name,
          ApiToken: androidApp.appToken,
        }
        return currentSettings
      })
      await Codepush.createDeployment(defaultBranchName, 'android')
    } catch (e) {
      console.error('Error creating Android application', ...formatError(e))
      process.exit(1)
      return
    }

  },
)
