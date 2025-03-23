import type { Breadcrumb, ClientOptions, SeverityLevel, Client } from '@sentry/types'
import { LoggerConfig } from '../types'

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
    return this.config.Sentry.provider
  }

  private get enabled() {
    return this.config.Sentry.enabled
  }

  constructor(private config: LoggerConfig) {
    if (config.Sentry.enabled) {
      const initOptions: ClientOptions = {
        dsn: config.Sentry.dsn,
        debug: config.Sentry.debug,
        beforeBreadcrumb: config.Sentry.beforeBreadcrumb,
        integrations: [],
        enabled: this.enabled,
        ...config.Sentry.initArgs,
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