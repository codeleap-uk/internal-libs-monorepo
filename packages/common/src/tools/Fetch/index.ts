import { AppSettings } from '../../config'
import { RequestClientConfig } from './types'
import { RequestClient } from './RequestClient'
import { AxiosHeaders } from 'axios'
export * from 'axios'
export * from './types'

export { RequestClient } from './RequestClient'

export function makeFetcher(
  settings: AppSettings,
  override?: Partial<RequestClientConfig>,
) {
  return new RequestClient({
    baseURL: settings.Environment.IsDev ? settings.Fetch.DevelopmentURL : settings.Fetch.ProductionURL,
    automaticMultipartParsing: true,
    headers: new AxiosHeaders(),
    ...override,
  })
}
