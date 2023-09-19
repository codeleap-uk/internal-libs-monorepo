const fs = require('fs')

type Settings = {
  articlesOutputDir: string
  typedocsOutputDir: string
  typedocsDir: string
  articlesDir: string
  environment: string
  articleGeneratorExtension: string

  maxTypedocsGenerator: number
  generateEnabled: boolean
  typedocDocumentedTypes: boolean

  module: 'components' | 'styles'
  package: 'web' | 'common' | 'mobile'
}

function config(): Settings {
  const settingsJSON = fs.readFileSync(`./docs/settings.json`).toString()
  const settings: Settings = JSON.parse(settingsJSON)

  const getOutputDir = (path: string) => {
    return path + '/' + settings.package + '/' + settings.module
  } 

  return {
    ...settings,
    articlesOutputDir: getOutputDir(settings.articlesOutputDir),
    typedocsOutputDir: getOutputDir(settings.typedocsOutputDir)
  }
}

export const GeneratorConfig = config()
