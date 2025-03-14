import axios from 'axios'
import { codeleapCommand } from '../lib/Command'
import { resolveDir, resolveFile, writeFile } from '../utils'
import { USER_CONFIG } from '../constants'
import cliProgress from 'cli-progress'

const testEnabled = false

async function translate(text: string, options) {
  if (testEnabled) {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        resolve("Test")
      }, 1000)
    })
  }

  const base = "https://translate.googleapis.com/translate_a/single"

  let response = await axios.post(`${base}?client=gtx&sl=${options?.from}&tl=${options?.to}&dt=t&q=${encodeURIComponent(text)}`)

  let result = response.data

  result = result && result[0] && result[0][0] && result[0].map((s) => s[0]).join("")

  if (!result) return null

  return new Promise((resolve, reject) => setTimeout(() => resolve(result), 1000))
}

export const linguiTranslateCommand = codeleapCommand(
  {
    name: 'lingui-translate',
    help: {
      description: 'Translate app locales',
    },
  },
  async ({ _ }) => {
    console.log(`Starting translation process, this may take some time`)

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    const quotesRegex = /msgstr\s+"(.*?)"/

    const baseLanguage = USER_CONFIG.translate.baseLanguage

    const locales = resolveDir(config => config.translate.localesDir).filter(l => l.endsWith('.po'))

    const basePoContent = resolveFile(config => [config.translate.localesDir, baseLanguage + '.po']).split('\n')
    
    bar.start(basePoContent.length, 0)

    const finished = await new Promise(async (resolve, reject) => {
      for (const po of locales) {
        bar.update(0)
  
        const language = po.split('.')[0]
  
        if (language === baseLanguage) continue
  
        console.log(`\nTranslating locale: ${language}`)
  
        const poContent = resolveFile(config => [config.translate.localesDir, po]).split('\n')
  
        let updatedPoContent = [...poContent]
  
        for (let i = 0; i < basePoContent.length; i++) {
          const currentLanguageLine = poContent[i]
          const baseLanguageLine = basePoContent[i]
  
          const hadTranslated = !currentLanguageLine.includes('""')
          const isNotTextLine = !currentLanguageLine.includes('msgstr')
  
          if (isNotTextLine || hadTranslated) continue
  
          const text = baseLanguageLine.match(quotesRegex)[1]
  
          const translatedText = await translate(text, { from: baseLanguage, to: language })
  
          if (translatedText) {
            updatedPoContent[i] = currentLanguageLine.replace(quotesRegex, `msgstr "${translatedText}"`)
          }
  
          bar.update(i + 1)
        }

        if (!testEnabled) {
          writeFile(config => [config.translate.localesDir, po], updatedPoContent.join('\n'))
        }

        bar.increment()
        console.log(`\nCompleted translation locale: ${language}`)
      }

      setTimeout(() => resolve(true), 1000)
    })

    if (finished) {
      console.log(`\nAll translations completed successfully`)
      process.exit(0)
    }
  },
)