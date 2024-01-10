import { GeneratorConfig } from './config'
import { GenLogger } from './logger'

const fs = require('fs')
const path = require('path')

export function deleteComponentDocsDir() {
  if (!fs.existsSync(GeneratorConfig.articlesOutputDir)) return

  GenLogger.echo('Deleting', { dir: GeneratorConfig.articlesOutputDir })

  fs.readdirSync(GeneratorConfig.articlesOutputDir).forEach((file) => {
    const filePath = path.join(GeneratorConfig.articlesOutputDir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      deleteComponentDocsDir()
    } else {
      fs.unlinkSync(filePath)
    }
  })

  fs.rmdirSync(GeneratorConfig.articlesOutputDir)

  console.log('deleted component docs dir')
}
