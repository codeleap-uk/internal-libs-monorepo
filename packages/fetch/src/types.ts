import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { APIError } from './APIError'

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
type MiddleWares<T> = {
  requestMiddleware?: Middleware<T>[]
  responseMiddleware?: Middleware<AxiosResponse>[]
}
export type ExtraProperties = {
  rejectOnCancel?: boolean
  duplicateBehavior?: 'cancelPrevious' | 'maintainPrevious'
  multipart?: MultipartConfig | boolean
  logger?: any
  debug?: boolean
  automaticMultipartParsing?: boolean
  multipartParser?: (body:any) => FormData | Promise<FormData>
  silent?: boolean
  onError?: (e: APIError) => void
  errorLogSeverity?: 'error' | 'warn' | 'log'
}

type ReqConfig<D = any, Extending = AxiosRequestConfig > = Extending & ExtraProperties & MiddleWares<Extending & ExtraProperties>

export type RequestClientConfig<D = any> = ReqConfig<D, InternalAxiosRequestConfig>
export type InternalRequestClientConfig<D = any> = ReqConfig<D, InternalAxiosRequestConfig>

export type ExternalRequestClientConfig<D = any> = AxiosRequestConfig<D> & ExtraProperties

export type AugmentedAxiosError<T = any, D = any> = Omit<
  AxiosError<T, D>,
  'config'
> & {
  config: AxiosError<T, D>['config'] & ExtraProperties
}
