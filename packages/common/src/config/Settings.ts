import { DeepPartial, Matcher } from '..'
import { LogType, SentryProvider } from '../tools/Logger/types'

export type AppSettings = DeepPartial<{
  AppName: string;
  Description: string;
  Environment: {
    IsDev: boolean;
    Type: 'production' | 'development';
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
  };
  Social: {
    FaceURL: string;
    LinkedinURL: string;
  };
  ContactINFO: {
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
