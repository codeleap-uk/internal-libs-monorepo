
export interface AppSettingsConfig {
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
      enable?: boolean
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