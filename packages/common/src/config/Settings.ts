import { DeepPartial, Matcher } from '..'
import { LogType, SentryProvider } from '../tools/Logger/types'

export type AppSettings<
  _SentryProvider extends SentryProvider = SentryProvider
> = DeepPartial<{
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
    provider: _SentryProvider
    debug?: boolean
    initArgs?: Partial<Parameters<_SentryProvider['init']>[0]>
    beforeBreadcrumb?: any
  }
  Performancer: {
    enable: boolean
    maxRenders: number
  }
  Logger: {
    Level: LogType | LogType[]
    DeviceIdentifier?: string
    IgnoreWarnings?: string[]
    StringifyObjects?: boolean
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
}>

export type ConfigurableSettings = Pick<
  AppSettings,
  'Fetch' | 'Logger' | 'ApiCredentials'
>
