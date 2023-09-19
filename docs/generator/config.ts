import { Settings } from './types'

const fs = require('fs')

const timestamp = String(new Date().getTime())

function config(): Settings {
  const settingsJSON = fs.readFileSync(`./docs/settings.json`).toString()

  let settings: Settings = JSON.parse(settingsJSON)

  const isTestMode = settings.mode === 'test'
  const isDiffMode = settings.mode === 'diff'

  const getOutputDir = (path: string) => {
    let finalDir: string = settings.module

    if (isDiffMode) {
      fs.writeFileSync('./docs/diff_timestamp.json', timestamp, {
        'encoding': 'ascii'
      })

      finalDir = `diff_` + timestamp
    } else if (isTestMode) {
      finalDir = 'test_' + settings.module
    }

    return path + '/' + settings.package + '/' + finalDir
  }

  return {
    ...settings,
    articlesOutputDir: getOutputDir(settings.articlesOutputDir),
    typedocsOutputDir: getOutputDir(settings.typedocsOutputDir)
  }
}

export const GeneratorConfig = config()
