import { LocalStorage as _LocalStorage } from '@codeleap/web'

export const LocalStorageKeys = {
  SESSION_IS_DEV: '@Session.isDevelopment',
  TESTER: '@CodeleapTester',
  LOCALE: '@locale',
  PERSIST_AUTH: '@auth.has_user',
  IN_REAUTHENTICATION: '@auth.in_reauthentication',
  ONBOARDING_FINISHED: '@Onboarding.finished',
  COLOR_SCHEME: '@ColorScheme',
}

export const LocalStorage = new _LocalStorage(LocalStorageKeys)
