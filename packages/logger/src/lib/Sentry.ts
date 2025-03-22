import type { Breadcrumb, ClientOptions } from '@sentry/types'
import { SentrySeverityMap, SentryProvider } from './types'
import { appSettings } from './Settings'

export class SentryService {
  get provider(): SentryProvider {
    return appSettings.config.Sentry.provider
  }

  private get enabled() {
    return appSettings.config.Sentry.enable
  }

  constructor() {
    if (this.enabled) {
      const config = appSettings.config.Sentry

      const initOptions: ClientOptions = {
        dsn: config.dsn,
        debug: config.debug,
        beforeBreadcrumb: config.beforeBreadcrumb,
        integrations: [],
        ...config.initArgs,
      }

      this.provider?.init?.(initOptions)
    }
  }

  captureBreadcrumb(type: string, content: [string, any, string]) {
    if (!this.enabled) return

    const [message, data, category] = content

    const sentryArgs: Breadcrumb = {
      message,
      data,
      category,
      level: SentrySeverityMap[type],
      type: '',
    }

    this.provider.addBreadcrumb(sentryArgs)
  }

  sendLog(err?: any) {
    if (!this.enabled) return

    this.provider.captureException(err)
  }
}