import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Logger } from '../Logger'

export type FetchFailure =
  | 'NO_RESPONSE'
  | 'SETUP_ERROR'
  | 'INVALID_STATUS_CODE'
  | 'REQUEST_ABORTED'
  | 'ALREADY_IN_PROGRESS'

export type RequestQueueItem = AxiosRequestConfig & {
  requestStatus: 'failed' | 'successful' | 'in_progress'
  errorReason?: FetchFailure
  controller: AbortController
}

export interface IRequestClient {
  queue: Record<string, RequestQueueItem>
  setInQueue(req: RequestQueueItem): void
  setConfig(config:Partial<RequestClientConfig>):void
}

type MultipartConfig = {
  keyTransforms?: Record<string, 'file' | 'json' | 'image'>
}

export type Middleware<T> = (current: T) => Promise<T | void>

export type RequestClientConfig<D = any> = AxiosRequestConfig<D> & {
  rejectOnCancel?: boolean
  duplicateBehavior?: 'cancelPrevious' | 'maintainPrevious'
  multipart?: MultipartConfig | boolean
  requestMiddleware?: Middleware<RequestClientConfig>[]
  responseMiddleware?: Middleware<AxiosResponse>[]
  logger?: Logger
  debug?: boolean
  automaticMultipartParsing?: boolean
  multipartParser?: (body:any) => FormData
  silent?: boolean
  onError?: (e: AxiosError) => void
}
