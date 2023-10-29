export type CodeleapCLIUserConfig = {
  GITHUB_TOKEN: string
  SHELL?: string
}

export type CodepushAppConfig = {
  ApplicationName: string
  ApiToken: string
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
  'codepush': {
    ApplicationName: string
    OwnerName: string
    ios: CodepushAppConfig
    android: CodepushAppConfig
  }
}
