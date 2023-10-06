import { codeleapCommand } from '../lib/Command'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { inquirer } from '../lib'
import '../lib/firebase'

type Settings = {
  input: string
  output: string
  convertor: {
    compressionQuality: number
    resizeWidth: number
    inputFormats: string[]
    ignoreFiles: string[]
  }
}

const commandName = 'convertor-webp'

export const convertorWebpCommand = codeleapCommand(
  {
    name: commandName,
    parameters: [
      '[settingsPath]',
    ],
    help: {
      description: 'Command for easily convertor to webp, compression and resize images.',
      examples: [
        `codeleap ${commandName} ./src/app/assets/convertor.settings.json`,
      ],
    },
  },
  async (argv) => {
    const { flags, _ } = argv
    
    let settingsPath = _.settingsPath

    if (!settingsPath) {
      const answers = await inquirer.prompt([
        {
          message: `Please insert the settings path.`,
          name: 'settings',
        },
      ])

      settingsPath = answers.settings
    }

    if (!fs.existsSync(settingsPath)) {
      console.error('Settings not found, check path:', settingsPath)
      return
    }

    const settingsJSON = fs.readFileSync(settingsPath).toString()

    let settings: Settings = JSON.parse(settingsJSON)

    console.log('Starting conversion', settings)

    if (!fs.existsSync(settings.output)) {
      fs.mkdirSync(settings.output)
    }
    
    let files = []

    if (fs.existsSync(settings.input)) {
      const inputFiles: string[] = fs.readdirSync(settings.input)

      for (const inputFile of inputFiles) {
        const isCorrectFormat = settings?.convertor?.inputFormats?.some(
          _format => inputFile?.endsWith(_format)
        )

        const isIgnoredFile = settings.convertor.ignoreFiles.includes(inputFile?.split('.')[0])

        if (isCorrectFormat && !isIgnoredFile) {
          files.push(inputFile)
        }
      }

    } else {
      console.error('Input folder not found, check settings', settings)
      return
    }

    console.log('Files to convert', files)

    for (const file of files) {
      const inputPath = path.join(settings.input, file);
      const outputPath = path.join(settings.output, path.parse(file).name + '.webp')

      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath)
      }

      const img = sharp(inputPath)
      const img_metadata = await img.metadata()

      let imageProcessing = img.webp({ quality: Number(settings?.convertor?.compressionQuality) })

      const needResize = img_metadata?.width && img_metadata?.width > settings?.convertor?.resizeWidth

      if (needResize) {
        const newWidth = parseInt(String(settings?.convertor?.resizeWidth))
        const newHeight = parseInt(String(img_metadata.height * (newWidth / img_metadata.width)))

        imageProcessing = imageProcessing.resize({ width: newWidth, height: newHeight })
      }

      const hasAlfaChannels = img_metadata.channels && img_metadata.channels >= 4

      if (hasAlfaChannels) {
        imageProcessing = imageProcessing.toColorspace('srgb')
      }

      imageProcessing.toFile(outputPath, (err, info) => {
        if (err) {
          console.error(`Error converting ${file} to webP`, err)
        } else {
          console.log(`Image ${file} converted to webP`, info)
        }
      })
    }
  },
)
