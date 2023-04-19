import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
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
type MiddleWares<T> = {
  requestMiddleware?: Middleware<T>[]
  responseMiddleware?: Middleware<AxiosResponse>[]
}
type ExtraProperties = {
  rejectOnCancel?: boolean
  duplicateBehavior?: 'cancelPrevious' | 'maintainPrevious'
  multipart?: MultipartConfig | boolean
  logger?: Logger
  debug?: boolean
  automaticMultipartParsing?: boolean
  multipartParser?: (body:any) => FormData
  silent?: boolean
  onError?: (e: AxiosError) => void
}

type ReqConfig<D = any, Extending = AxiosRequestConfig, T = Extending & ExtraProperties > = T & MiddleWares<T>

export type RequestClientConfig<D = any> = ReqConfig<D, InternalAxiosRequestConfig>
export type InternalRequestClientConfig<D = any> = ReqConfig<D,InternalAxiosRequestConfig> 

