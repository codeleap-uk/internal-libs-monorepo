const fs = require('fs')

import { GenLogger } from './logger'
import { deleteComponentDocsDir } from './cleaners'
import { getComponents } from './getComponents'
import { generateComponentsTypeDocs } from './typedoc'
import { GeneratorIA } from './ia'

async function main() {
  GenLogger.log('Starting...')

  deleteComponentDocsDir()

  const components = await getComponents()

  const typeDocsPath = await generateComponentsTypeDocs(components)

  const typeDocsDirs = fs.readdirSync(typeDocsPath, {
    'withFileTypes': true,
  })

  // return null

  const openai = await GeneratorIA.initialize()

  const articles = await GeneratorIA.articleGenerator(openai, typeDocsDirs)

  return articles
}

main().catch(e => GenLogger.exception(e))
