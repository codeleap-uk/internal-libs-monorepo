import { DeepPartial } from '..'
import { LogType, SentryProvider } from '../tools/Logger/types'

export type AppSettings = DeepPartial<{
    AppName:string
    Description:string
    Environment: {
        IsDev:boolean
        Type: 'production' | 'development'
    }
    Sentry: {
        enable: boolean,
        dsn:string
        provider: SentryProvider
    }
    Logger: {
        Level: LogType,
        IgnoreWarnings?: string[]

    }
    Vars: {
        GooglePlayURL : string
        AppStoreURL: string
        WebsiteURL: string
    },
    Fetch: {
        ApiURL: string
    }
}>
