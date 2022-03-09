import { AppSettings } from '../../config'
import { RequestClientConfig } from './types'
import { RequestClient } from './RequestClient'
export * from 'axios'
export * from './types'
export { RequestClient } from './RequestClient'

export function makeFetcher(
  settings: AppSettings,
  override?: Partial<RequestClientConfig>,
) {
  return new RequestClient({
    baseURL: settings.Fetch.ApiURL,
    automaticMultipartParsing: true,
    ...override,
  })
}
