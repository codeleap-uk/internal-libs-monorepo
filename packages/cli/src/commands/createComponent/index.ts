import { codeleapCommand } from '../../lib/Command'
import { inquirer, path } from '../../lib'
import { createFile, formatComponentName, generateComponentFile, generateStylesheetFile, updateComponentsImport, updateStylesheetsImport } from './utils'
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
        name: 'componentName',
        message: 'Component Name?',
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
        name: 'componentNameFolder',
        message: 'In which folder would you like to create the component? (default is shared)',
        default: 'shared',
      },
    ])

    const answerName = answers.componentName.trim()
    const componentFolder = answers.componentNameFolder.trim()
    const componentName = formatComponentName(answerName)

    const componentsFileDir = path.join(cliDir, USER_CONFIG.components.componentsDir, componentFolder)
    const stylesheetsDir = path.join(cliDir, USER_CONFIG.components.stylesheetsDir)
    const componentsDir = path.join(cliDir, USER_CONFIG.components.componentsDir)

    const componentFileName = `${componentName}.tsx`
    const stylesheetFileName = `${componentName}.ts`

    const componentFilePath = path.join(componentsFileDir, componentFileName)
    const stylesheetFilePath = path.join(stylesheetsDir, stylesheetFileName)

    const componentContent = generateComponentFile(componentName, USER_CONFIG.components?.app)
    const stylesheetContent = generateStylesheetFile(componentName, USER_CONFIG.components?.app)

    createFile({
      dir: componentsFileDir,
      filePath: componentFilePath,
      content: componentContent,
      fileName: `${componentName}.tsx`,
    })

    createFile({
      dir: stylesheetsDir,
      filePath: stylesheetFilePath,
      content: stylesheetContent,
      fileName: `${componentName}.ts`,
    })

    updateStylesheetsImport(stylesheetsDir, componentName)
    updateComponentsImport(componentsDir, componentFolder, componentName)
  },
)
