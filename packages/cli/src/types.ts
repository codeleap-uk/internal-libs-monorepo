export type CodeleapCLIUserConfig = {
  GITHUB_TOKEN: string
  SHELL?: string

  'convertor-webp'?: {
    input: string
    output: string
    convertor: {
      compressionQuality: number
      resizeWidth: number
      processColorChannels: boolean
      inputFormats: string[]
      ignoreFiles: string[]
    }
    mode: 'multi' | 'single'
  }
  theme?: {
    assets: {
      contextColors: string
      globalColors: string
      measureTokens: string
    }
    configure: {
      output: string
    }
  }
}

export type CodeleapCLISettings = {
  'convertor-webp': {
    input: string
    output: string
    convertor: {
      compressionQuality: number
      resizeWidth: number
      processColorChannels: boolean
      inputFormats: string[]
      ignoreFiles: string[]
    }
    mode: 'multi' | 'single'
  }
  'theme': {
    assetsPath: string
  }
}
