import { createSettings } from '@codeleap/common'
import Obfuscate from './Obfuscate'

export const IsDevEnv = process.env.NODE_ENV === 'development'

const enableSentry = !IsDevEnv

const ENV = IsDevEnv ? 'development' : 'production'

let _Settings = createSettings({
  AppName: 'Codeleap UI',
  CompanyName: 'Example Ltd.',
  Description: 'This is a template',
  Environment: {
    IsDev: IsDevEnv,
    Type: ENV,
    InitTime: new Date(),
  },
  Application: {
    IsBrowser: false,
  },
  PerformanceInspector: {
    enable: true,
    maxRenders: 30,
  },
  Fetch: {
    ProductionURL: 'https://prod.codeleap.co.uk/',
    DevelopmentURL: 'https://dev.codeleap.co.uk/',
    ViewHTMLErrors: true,
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
    // TODO - get device or browser id
    DeviceIdentifier: '',
    StringifyObjects: true,
    IgnoreWarnings: [
      `[react-native-gesture-handler] Seems like you're using`,
      `Require cycle:`,
      `Require cycles are allowed`,
      `Running `,
      `WARN  Require cycle`,
      ` Warning: Failed`,
      `Warning: Failed`,
      'new NativeEventEmitter',
      'User cancelled',
      'React does not recognize the',
      'Unknown event handler property',
      'forwardRef render functions accept exactly ',

    ],
    Obfuscate,
    ComponentLogging: true,
  },
  Sentry: {
    enable: enableSentry,
    provider: null,
    initArgs: {
      enabled: enableSentry,
      environment: ENV,
    },
    dsn: 'https://e929273c465943e98c540b1839a72afb@o309198.ingest.sentry.io/4505370694975488',
  },
  Slack: {
    echo: {
      icon: 'https://avatars.githubusercontent.com/u/48894125?s=200&v=4',
      token: 'xoxb-622265672359-1248324007429-Ts31vPT8jCNh7L99xtdbOgQB',
      channel: '#_dev_logs',
    },
  },
  ApiCredentials: {
    GoogleSignin: {
      WebClientId:
        '268760770384-ob7jfjntuorgqaj2tt2mvnqdokd634et.apps.googleusercontent.com',
    },
    AppleSignIn: {
      ServiceClientId: '',
      RedirectURI: '',
    },
    FacebookSDK: {
      AppId: '1130448934268035',
    },
  },
})

if (_Settings.Environment.IsDev) {
  // TODO read environment
  // _Settings = deepMerge(_Settings, env)
}

if (!_Settings.ContactINFO.TermsAndPrivacy) {
  _Settings.ContactINFO.TermsAndPrivacy = `https://codeleap.co.uk/dev/policies/?app=${Buffer.from(_Settings.AppName, 'base64')}`
}

export const Settings = _Settings
