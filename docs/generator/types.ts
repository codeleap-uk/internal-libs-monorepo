
export type Settings = {
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

export type Component = {
  name: string
  path: string
}

export type ComponentPropDoc = {
  name: string
  type: string
  optional: boolean
}