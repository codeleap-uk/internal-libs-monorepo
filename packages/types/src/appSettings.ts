import { DeepPartial, Matcher, LogType } from '.'

export type AppSettings = DeepPartial<{
  AppName: string
  
  CompanyName: string

  CompanySuffix: string

  Description: string

  Environment: {
    IsDev: boolean
    Type: 'production' | 'development'
    InitTime: any
  }

  Application: {
    IsBrowser: boolean
  }

  BaseURL: string

  Sentry: {
    enable: boolean
    dsn: string
    provider: any
    debug?: boolean
    initArgs?: any
    beforeBreadcrumb?: any
  }

  PerformanceInspector: {
    enable: boolean
    maxRenders: number
    blacklist?: string[]
  }

  Logger: {
    Level: LogType | LogType[]
    DeviceIdentifier?: string
    IgnoreWarnings?: string[]
    StringifyObjects?: boolean
    isMain?: boolean
    inspect?: any
    alwaysSendToSentry?: boolean
    Obfuscate: {
      keys: Matcher<'key'>[]
      values: Matcher<'value'>[]
    }
  }

  Vars: {
    GooglePlayURL: string
    AppStoreURL: string
    WebsiteURL: string
    PrivacyPolicy: string
  }

  Fetch: {
    ProductionURL: string
    DevelopmentURL: string
  }

  Social: {
    FaceURL: string
    LinkedinURL: string
  }

  ContactINFO: {
    Website: string
    TermsAndPrivacy: string
    SupportEMAIL: string
    ContactEMAIL: string
    ContactPHONE: string
  }

  ApiCredentials: {
    GoogleSignin: {
      WebClientId: string
    }
    FacebookSDK: {
      AppId: string
    }
  }

  Slack: {
    echo: {
      channel?: string
      icon: string
      token: string
      baseURL?: string
      enabled?: boolean
      options?: Record<string, any>
    }
  }
}>

export type ConfigurableSettings = Pick<
  AppSettings,
  'Fetch' | 'Logger' | 'ApiCredentials'
>
