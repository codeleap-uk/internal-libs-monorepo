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
      description: 'Command to set application theme using figma files.',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
  },
  async (argv) => {
    const { flags, _ } = argv

    const measures = createThemeFile({
      fileName: 'measures',
      content: resolveMeasure(),
    })

    logObj(measures)

    const globalColors = createThemeFile({
      fileName: 'baseColors',
      content: resolveGlobalColors(),
      folder: 'colors',
    })

    logObj(globalColors)

    const contextColors = resolveContextColors()

    for (const modeName in contextColors) {
      createThemeFile({
        fileName: modeName,
        content: contextColors[modeName],
        folder: 'colors',
        render: (name, content) => {
          const colors = Object.entries(content).map(([key, value]) => `  ${key}: colors.${value},`).join(`\n`)

          return `import colors from './baseColors'\n\nexport default {\n${colors}\n}`
        }
      })
    }

    logObj(contextColors)
  },
)