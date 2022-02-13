import { Breadcrumb } from '@sentry/browser'
import { AppSettings } from '../../config/Settings'
import {
  LogFunctionArgs,
  LogType,
  SentrySeverityMap,
  SentryProvider,
} from './types'

export class SentryService {
  private sentry: SentryProvider;

  private use: boolean;

  constructor(settings: AppSettings) {
    this.use = settings?.Sentry?.enable
    this.sentry = settings?.Sentry?.provider as SentryProvider
    if (this.use) {
      const isDebug = settings?.Sentry?.debug || false
      if (isDebug) console.log('> > > Initializing Sentry', settings.Sentry)
      this.sentry.init({
        dsn: settings.Sentry.dsn,
        debug: isDebug,
      })
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
