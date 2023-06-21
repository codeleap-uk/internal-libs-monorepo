
import { codeleapCommand } from '../lib/Command'
import { createMobileApp, fs, inquirer } from '../lib'
import '../lib/firebase'
const commandName = 'syncIcons'

const supportedExtensions = [ 'png', 'jpg', 'jpeg']

export const syncIconsCommand = codeleapCommand(
  {
    name: commandName,
    
    help: {
      description: 'Synchronize icons from the app/assets/icons folder into a ts file with their exports',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
    flags: {
      logdiff: {
        type: Boolean,
        default: true,
      },
    },

  },
  async (argv) => {
    const { flags, _ } = argv
    
    const iconFiles = fs.readdirSync('./src/app/assets/icons', {
      withFileTypes: true,
    }).filter(i => {
      const extension = i.name.split('.').pop()
      return i.isFile() &&  supportedExtensions.includes(extension)
    })

    const iconEntries = iconFiles.map((iconFile) => {
        const extension = iconFile.name.split('.').pop().toLowerCase()

        const filename = iconFile.name.replace(`.${extension}`, '')

        return [filename, iconFile.name]
    })

    const iconEntriesString = iconEntries.map(([key, value]) => {
        return `  '${key}': require('./${value}'),`
    }
    ).join('\n')

    const iconEntriesFile = `export const imageIcons = {
${iconEntriesString}
}`
    fs.writeFileSync('./src/app/assets/icons/exports.ts', iconEntriesFile)


    if (flags.logdiff) {
        console.log(iconEntriesFile)
    }
  },
)
