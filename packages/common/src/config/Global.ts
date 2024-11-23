import { AppSettings, Logger, RequestClient } from '..'

export type GlobalVars = {
  Logger: Logger
  Settings: AppSettings
  Api: RequestClient

}
