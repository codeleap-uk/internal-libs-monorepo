import { AppSettings } from '@codeleap/common'
import Obfuscate from './Obfuscate'
import * as Sentry from '@sentry/browser'
const ENV = process.env.NODE_ENV as AppSettings['Environment']['Type']

export const Settings: AppSettings = {
  AppName: 'Codeleap Docs',
  CompanyName: 'Example Ltd.',
  Description: 'This is a template',
  Environment: {
    IsDev: ENV == 'development',
    Type: ENV,
  },
  Application: {
    IsBrowser: false,
  },
  Fetch: {
    ApiURL: 'https://dev.codeleap.co.uk/',
    ProductionURL: 'https://dev.codeleap.co.uk/',
    DevelopmentURL: 'https://dev.codeleap.co.uk/',
  },
  Social: {
    FaceURL: 'https://www.facebook.com/codeleapuk/',
    LinkedinURL: 'https://www.linkedin.com/company/codeleap-uk',
  },
  ContactINFO: {
    Website: 'codeleap.co.uk',
    TermsAndPrivacy: 'https://codeleap.co.uk',
    SupportEMAIL: 'support@codeleap.co.uk',
    ContactEMAIL: 'hello@codeleap.co.uk',
    ContactPHONE: '+44 (0) 333 050 9420',
  },
  Logger: {
    Level: 'debug',
    IgnoreWarnings: [
      `[react-native-gesture-handler] Seems like you're using`,
      `Require cycle:`,
      `Require cycles are allowed`,
      `Running `,
      `WARN  Require cycle`,
      ` Warning: Failed`,
      `Warning: Failed`,
    ],
    Obfuscate,
  },
  Sentry: {
    enable: false,
    provider: Sentry,
    dsn: 'https://358ebbb4bd4e4ccc89d3d955f26b34e0@o309198.ingest.sentry.io/5824684',
    debug: false,
  },
  ApiCredentials: {
    GoogleSignin: {
      WebClientId:
        '268760770384-a07ccfukq9vpngc6jcdiucjq0r53arte.apps.googleusercontent.com',
    },
    FacebookSDK: {
      AppId: '116173886421758',
    },
  },
}
