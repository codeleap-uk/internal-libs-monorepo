
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

// export type Type = {
//   type: TypeName
//   target: {
//     sourceFileName: 'string'
//     qualifiedName: string
//   }
//   name: string
//   typeArguments: {
//     type: TypeName
//     target: {
//       sourceFileName: 'string'
//       qualifiedName: string
//     }
//     name: string
//     typeArguments: {
//       type: TypeName
//       value: string
//       types: {
//         type: TypeName
//         name: string
//       }[]
//     }[]
//   }[]
// }

type TypeTarget = {
  sourceFileName: string
  qualifiedName: string
}

export type Type = {
  type: 'reference'
  typeArguments?: Type[]
  target: TypeTarget
} | {
  type: 'intersection'
  types?: Type[]
} | {
  type: 'intrinsic'
  name: string
} | {
  type: 'union'
  types?: Type[]
} | {
  type: 'array'
  elementType: Type
} | {
  type: 'reflection'
  declaration: {
    children?: Type[]
  }
}

export type TypeDocChildren = {
  id: number
  name: string
  variant: 'declaration'
  flags: {
    isOptional: boolean
  }
  comment: {
    summary: {
      text: string
    }[]
  }
  type: Type
}
