import type { Breadcrumb, ClientOptions } from '@sentry/types'
import { AppSettings } from '../../config/Settings'
import {
  LogFunctionArgs,
  LogType,
  SentrySeverityMap,
  SentryProvider,
} from './types'

export class SentryService {
  private sentry: SentryProvider

  private use: boolean

  constructor(settings: AppSettings) {
    this.use = settings?.Sentry?.enable
    this.sentry = settings?.Sentry?.provider as SentryProvider
    if (this.use) {
      const isDebug = settings?.Sentry?.debug || false
      if (isDebug) console.log('> > > Initializing Sentry', settings.Sentry)
      const initObj:ClientOptions = {
        dsn: settings.Sentry.dsn,
        debug: isDebug,
        // @ts-expect-error - These are provided by platform specific Sentry providers
        integrations: [],
        ...settings?.Sentry?.initArgs,
      } 
      if (settings?.Sentry?.beforeBreadcrumb) {
        initObj.beforeBreadcrumb = settings?.Sentry?.beforeBreadcrumb
      }
      this.sentry.init(initObj)
    }
  }

  captureBreadcrumb(type: LogType, content: LogFunctionArgs) {
    if (!this.use) return
    const [message, data, category] = content

    const sentryArgs: Breadcrumb = {
      message,
      data,
      category,
      level: SentrySeverityMap[type],
      type: '',
    }

    this.sentry.addBreadcrumb(sentryArgs)
  }

  sendLog(err?: any) {
    if (!this.use) return
    this.sentry.captureException(err)
  }
}
