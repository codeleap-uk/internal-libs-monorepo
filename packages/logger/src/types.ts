
export type LoggerConfig = {
  AppName: string
  
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
      enabled: boolean
      maxRenders: number
      blacklist: string[]
    }
  }

  Sentry: {
    enabled: boolean
    dsn: string
    provider: any
    debug?: boolean
    initArgs?: any
    beforeBreadcrumb?: any
  }
}