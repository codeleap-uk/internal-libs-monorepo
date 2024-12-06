import { inspect } from 'util'
import { AugmentedAxiosError } from '.'

export class APIError<T= any, D = any> extends Error {
  reason?: string

  url?: string

  status?: number

  data?: T

  axiosError?: AugmentedAxiosError<T, D>

  method?: string

  constructor(
    reason = 'INVALID_STATUS_CODE',
    url = '',
    axiosError = null,
  ) {
    const status = axiosError?.response?.status
    const data = axiosError?.response?.data
    const method = axiosError?.config?.method
    const message = `
      APIError
      Reason: ${reason}
      Method: ${method}
      URL: ${url} 
      Status Code: ${status} 
      Response data: ${inspect(data, {
    depth: 3,
    compact: false,
    breakLength: 80,
  })}`
    super(message)

    this.reason = reason
    this.url = url
    this.method = method
    this.status = status
    this.data = data
    this.axiosError = axiosError
  }
}
