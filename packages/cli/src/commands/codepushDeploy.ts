import { getCurrentBranch, Codepush } from '../lib'
import { codeleapCommand } from '../lib/Command'
import os from 'os'
const commandName = 'codepush-deploy'

export const codepushDeploy = codeleapCommand(
  {
    name: commandName,
    parameters: [
      '[name]',
    ],
    help: {
      description: 'Update the codepush deployment from the current branch, creating it if it does not exist',
      examples: [
        `codeleap ${commandName} myAppName`,
      ],
    },

  },
  async (argv) => {
    const androidApp = await Codepush.getApplication('android')
    const iosApp = await Codepush.getApplication('ios')
    const branch = await getCurrentBranch()

    const androidDeploymentExists = await Codepush.deploymentExists(branch, 'android')

    if (!androidDeploymentExists) {
      await Codepush.addDeployment(branch, androidApp)
    }

    await Codepush.updateDeployment(branch, androidApp)

    if (os.platform() === 'darwin') {

      const iosDeploymentExists = await Codepush.deploymentExists(branch, 'ios')
      if (!iosDeploymentExists) {
        await Codepush.addDeployment(branch, iosApp)
      }
      await Codepush.updateDeployment(branch, iosApp)

    } else {
      console.log('Skipping iOS deployment as it is not supported on this platform')
    }

    console.log('Deployment updated')
  },
)
