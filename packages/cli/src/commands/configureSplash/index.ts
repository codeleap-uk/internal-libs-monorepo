import { USER_CONFIG } from '../../constants'
import { fs } from '../../lib'
import { codeleapCommand } from '../../lib/Command'
import { syncLaunchScreen, syncSplash } from './utils'

const commandName = 'configure-splash'

export const configureSplashCommand = codeleapCommand(
  {
    name: commandName,
    settingsRequired: true,
    parameters: [],
    help: {
      description: 'Command to set application splash using bootsplash files.',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
  },
  async (argv) => {
    const { flags, _ } = argv

    try {
      const splash = await syncSplash()
      const launchScreen = await syncLaunchScreen()

      if (splash && launchScreen) {
        setTimeout(() => {
          fs.rmSync(USER_CONFIG.splash.assetsDir, { recursive: true, force: true })
        }, 500)
      }
    } catch(err) {
      console.error(err)
    }
  },
)