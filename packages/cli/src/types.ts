export type AppType = 'web' | 'mobile'

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

  translate?: {
    localesDir: string
    baseLanguage: string
  }

  splash?: {
    assetsDir: string
    splashImagePath: string
    iosAppName: string
  }

  components?: {
    componentsDir: string
    stylesheetsDir: string
    app: AppType
  }
}
