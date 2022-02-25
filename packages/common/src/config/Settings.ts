import { DeepPartial, Matcher } from '..'
import { LogType, SentryProvider } from '../tools/Logger/types'

export type AppSettings = DeepPartial<{
  AppName: string;
  CompanyName: string;
  CompanySuffix: string;
  Description: string;
  Environment: {
    IsDev: boolean;
    Type: 'production' | 'development';
    InitTime: any;
  };
  Application: {
    IsBrowser: boolean;
  };
  BaseURL: string;
  Sentry: {
    enable: boolean;
    dsn: string;
    provider: SentryProvider;
    debug?: boolean;
  };
  Logger: {
    Level: LogType;
    DeviceIdentifier?: string;
    IgnoreWarnings?: string[];
    Obfuscate: {
      keys: Matcher<'key'>[]
      values: Matcher<'value'>[]
    }
  };
  Vars: {
    GooglePlayURL: string;
    AppStoreURL: string;
    WebsiteURL: string;
    PrivacyPolicy: string;
  };
  Fetch: {
    ApiURL: string;
    ProductionURL: string
    DevelopmentURL: string
  };
  Social: {
    FaceURL: string;
    LinkedinURL: string;
  };
  ContactINFO: {
    Website: string;
    TermsAndPrivacy: string;
    SupportEMAIL: string;
    ContactEMAIL: string;
    ContactPHONE: string;
  };

  ApiCredentials: {
    GoogleSignin: {
      WebClientId: string;
    };
    FacebookSDK: {
      AppId: string;
    };
  };
}>;
