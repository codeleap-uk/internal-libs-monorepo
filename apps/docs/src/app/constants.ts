export const LocalStorageKeys = {
  SESSION_IS_DEV: '@Session.isDevelopment',
  THEME: '@Theme.colorScheme',
  DELETION_REQUEST: '@AccountDeletion',
  TESTER: '@CodeleapTester',
  SERVER: '@server',
  LOCALE: '@locale',
  AppleUserName: (user: string) => `@AppleUserName.${user}`,
}

export const IS_SSR = typeof window === 'undefined'
