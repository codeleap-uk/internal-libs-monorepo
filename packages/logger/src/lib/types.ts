
export interface AppSettingsConfig {
  AppName: string
  
  logsEnabled: boolean

  Environment: {
    IsDev: boolean
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

  Logger: {
    ignoreLogs: string[]

    performanceInspector: {
      enable: boolean
      maxRenders: number
      blacklist: string[]
    }
  }

  Sentry: {
    enable: boolean
    dsn: string
    provider: any
    debug?: boolean
    initArgs?: any
    beforeBreadcrumb?: any
  }
}

import type { SeverityLevel, Client, ClientOptions } from '@sentry/types'

export const SentrySeverityMap: Record<string, SeverityLevel> = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  log: 'log',
  warn: 'warning',
  silent: 'log',
}

export type SentryProvider = {
  addBreadcrumb: any
  init(options: ClientOptions): Client
  captureException(err: any): void
}