import type { Breadcrumb, ClientOptions, SeverityLevel, Client } from '@sentry/types'
import { appSettings } from './Settings'

const SentrySeverityMap: Record<string, SeverityLevel> = {
  debug: 'debug',
  error: 'error',
  info: 'info',
  log: 'log',
  warn: 'warning',
  silent: 'log',
}

type SentryProvider = {
  addBreadcrumb: (args: Breadcrumb) => void
  init(options: ClientOptions): Client
  captureException(err: any): void
}

export class SentryService {
  get provider(): SentryProvider {
    return appSettings.config.Sentry.provider
  }

  private get enabled() {
    return appSettings.config.Sentry.enabled
  }

  constructor() {
    if (this.enabled) {
      const config = appSettings.config.Sentry

      const initOptions: ClientOptions = {
        dsn: config.dsn,
        debug: config.debug,
        beforeBreadcrumb: config.beforeBreadcrumb,
        integrations: [],
        enabled: this.enabled,
        ...config.initArgs,
      }

      this.provider?.init?.(initOptions)
    }
  }

  captureBreadcrumb(type: string, msg: string, data: any, category = `logger:${type}`) {
    if (!this.enabled) return

    const sentryArgs: Breadcrumb = {
      message: msg,
      data,
      category,
      level: SentrySeverityMap[type],
      type: '',
    }

    this.provider.addBreadcrumb(sentryArgs)
  }

  captureException(err: any) {
    if (!this.enabled) return

    this.provider.captureException(err)
  }
}