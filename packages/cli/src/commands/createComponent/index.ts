import { codeleapCommand } from '../../lib/Command'
import { inquirer, path } from '../../lib'
import { createFile, formatComponentName, generateComponentFile, generateStylesheetFile } from './utils'
import { cliDir, USER_CONFIG } from '../../constants'

const commandName = 'create-component'

export const createComponentCommand = codeleapCommand(
  {
    name: commandName,
    settingsRequired: true,
    parameters: [],
    help: {
      description: 'Command to create all files for a new component.',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
  },
  async () => {
    const answers = await inquirer.prompt([
      {
        name: 'name',
        message: 'What is the name of your component?',
        validate: (input: string) => {
          if (!input || input.trim().length === 0) {
            return 'Component name is required'
          }
          if (!/^[A-Za-z][A-Za-z0-9]*$/.test(input.trim())) {
            return 'Component name must start with a letter and contain only letters and numbers'
          }
          return true
        },
      },
      {
        name: 'folder',
        message: 'In which folder would you like to create the component? (default is shared)',
        default: 'shared',
      },
    ])

    const answerName = answers.name.trim()
    const folder = answers.folder.trim()
    const name = formatComponentName(answerName)

    const componentsDir = path.join(cliDir, USER_CONFIG.components.componentsDir, folder)
    const stylesheetsDir = path.join(cliDir, USER_CONFIG.components.stylesheetsDir)

    const componentFileName = `${name}.tsx`
    const stylesheetFileName = `${name}.ts`

    const componentFilePath = path.join(componentsDir, componentFileName)
    const stylesheetFilePath = path.join(stylesheetsDir, stylesheetFileName)

    const componentContent = generateComponentFile(name)
    const stylesheetContent = generateStylesheetFile(name)

    createFile({
      dir: componentsDir,
      filePath: componentFilePath,
      content: componentContent,
      fileName: `${name}.tsx`,
    })

    createFile({
      dir: stylesheetsDir,
      filePath: stylesheetFilePath,
      content: stylesheetContent,
      fileName: `${name}.ts`,
    })
  },
)

