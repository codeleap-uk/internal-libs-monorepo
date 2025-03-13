import axios from 'axios'
import { codeleapCommand } from '../lib/Command'
import { resolveDir, resolveFile, writeFile } from '../utils'
import { USER_CONFIG } from '../constants'

async function translate(text: string, options) {
  const base = "https://translate.googleapis.com/translate_a/single"

  let response = await axios.post(`${base}?client=gtx&sl=${options?.from}&tl=${options?.to}&dt=t&q=${encodeURIComponent(text)}`)

  let result = response.data

  result = result && result[0] && result[0][0] && result[0].map((s) => s[0]).join("")

  if (!result) return null

  return result
}

export const linguiTranslateCommand = codeleapCommand(
  {
    name: 'lingui-translate',
    help: {
      description: 'Translate app locales',
    },
  },
  async ({ _ }) => {
    const quotesRegex = /msgstr\s+"(.*?)"/

    const baseLanguage = USER_CONFIG.translate.baseLanguage

    const locales = resolveDir(config => config.translate.localesDir).filter(l => l.endsWith('.po'))

    const basePoContent = resolveFile(config => [config.translate.localesDir, baseLanguage + '.po']).split('\n')

    for (const po of locales) {
      const language = po.split('.')[0]

      if (language === baseLanguage) continue

      console.log(`Updating locale: ${language}`)

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
      }

      writeFile(config => [config.translate.localesDir, po], updatedPoContent.join('\n'))
    }
  },
)