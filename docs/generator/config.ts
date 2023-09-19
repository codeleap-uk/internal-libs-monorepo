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
  mode: 'test' | 'prod' | 'diff'
}

function config(): Settings {
  const settingsJSON = fs.readFileSync(`./docs/settings.json`).toString()
  let settings: Settings = JSON.parse(settingsJSON)

  const isTestMode = settings.mode === 'test'
  const isDiffMode = settings.mode === 'diff'

  const getOutputDir = (path: string) => {
    let finalDir: string = settings.module

    if (isDiffMode) {
      finalDir = `diff_` + String(new Date().getTime())
    } else if (isTestMode) {
      finalDir = 'test_' + settings.module
    }

    return path + '/' + settings.package + '/' + finalDir
  }

  if (isTestMode || isDiffMode) {
    settings.articleGeneratorExtension = 'test.mdx'
  }

  return {
    ...settings,
    articlesOutputDir: getOutputDir(settings.articlesOutputDir),
    typedocsOutputDir: getOutputDir(settings.typedocsOutputDir)
  }
}

export const GeneratorConfig = config()
