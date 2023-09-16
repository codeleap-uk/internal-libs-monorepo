import { GeneratorConfig } from './config'
import { GenLogger } from './logger'
import { Component } from './types'

const TypeDoc = require('typedoc')

export async function generateComponentsTypeDocs(components: Component[]): Promise<string> {
  for (const component of components) {
    if (!component?.path) {
      GenLogger.exception({ message: 'Invalid component', component })
    }

    const app = await TypeDoc.Application.bootstrapWithPlugins({
      entryPoints: [component?.path],
      'disableSources': true,
      'excludeReferences': true,
      'excludeExternals': true,
      'excludeInternal': true,
      'excludeNotDocumented': true, // TODO filtrar o children que tem comment
      // @ts-ignore
      'excludeCategories': true,
      'categorizeByGroup': true,
    })

    const project = await app.convert()

    if (project) {
      const outputDir = GeneratorConfig.typedocsOutputDir

      await app.generateJson(project, outputDir + `/${component?.name}.json`)
    }
  }

  return GeneratorConfig.typedocsOutputDir
}

export async function extractComponentTypeDoc() {

}
