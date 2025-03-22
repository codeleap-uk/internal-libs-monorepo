import { AppSettingsConfig } from '../types'

class AppSettings {
  public config = {} as AppSettingsConfig

  setConfig<T extends AppSettingsConfig>(config: T) {
    this.config = config as unknown as AppSettingsConfig
    return config as T
  }
}

export const appSettings = new AppSettings()