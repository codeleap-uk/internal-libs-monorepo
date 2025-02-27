import { codeleapCommand } from '../../lib/Command'
import { logObj } from '../../utils'
import { createThemeFile, resolveGlobalColors, resolveContextColors, resolveMeasure } from './utils'

const commandName = 'configure-theme'

export const configureThemeCommand = codeleapCommand(
  {
    name: commandName,
    settingsRequired: true,
    parameters: [],
    help: {
      description: 'Command for easily convertor to webp, compression and resize images.',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
  },
  async (argv) => {
    const { flags, _ } = argv

    const measures = createThemeFile('measures', resolveMeasure())

    logObj(measures)

    const globalColors = createThemeFile('colors', resolveGlobalColors())

    logObj(globalColors)

    const contextColors = resolveContextColors()

    for (const modeName in contextColors) {
      const colors = contextColors[modeName]

      createThemeFile(modeName, colors, (name, content) => {
        const colors = Object.entries(content).map(([key, value]) => `  ${key}: colors.${value},`).join(`\n`)
  
        return `import colors from './colors'\n\nexport default {\n${colors}\n}`
      })
    }

    logObj(contextColors)
  },
)