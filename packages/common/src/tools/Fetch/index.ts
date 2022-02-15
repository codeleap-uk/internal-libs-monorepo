import axios, {
  AxiosResponse,
  AxiosInstance,
  Axios,
  AxiosRequestConfig,
} from 'axios'
import { Logger } from '../Logger'
import { CancellablePromise } from '../../types'
import { AppSettings } from '../../config'
import { allMethods } from './constants'
import { IRequestClient, RequestClientConfig, RequestQueueItem } from './types'
import {
  buildRequest,
  getRequestId,
  parseFailedRequest,
  toMultipart,
} from './utils'
export * from 'axios' 
export * from './types'
/**
 * [[include:RequestClient.md]]
 */
export class RequestClient extends Axios implements IRequestClient {
  queue: IRequestClient['queue'];

  config: RequestClientConfig;

  axios: AxiosInstance;

  logger: Logger;

  constructor({ logger, ...config }: RequestClientConfig) {
    super(config)
    this.axios = axios.create(config)
    this.logger =
      logger ||
      new Logger({
        Logger: {
          Level: 'silent',
        },
      })
    this.axios.interceptors.request.use(async (c) => {
      let reqConfig = c as RequestClientConfig

      if (reqConfig.multipart) {
        reqConfig.data = toMultipart(reqConfig)
        reqConfig.headers = {
          ...reqConfig?.headers,
          'Content-Type': 'multipart/form-data',
        }
      }

      if (this.config.requestMiddleware) {
        for (const middleware of this.config.requestMiddleware) {
          reqConfig = (await middleware(reqConfig)) || reqConfig
        }
      }

      return reqConfig
    })
    this.axios.interceptors.response.use(async (axiosResponse) => {
      let response = { ...axiosResponse }

      if (this.config.responseMiddleware) {
        for (const middleware of this.config.responseMiddleware) {
          response = (await middleware(response)) || response
        }
      }

      return response
    })
    this.config = config
    this.queue = {}
  }

  setInQueue(req: RequestQueueItem) {
    const requestId = getRequestId(req, this.config)
    this.queue[requestId] = { ...this.queue[requestId], ...req }
  }

  setConfig(to:Partial<RequestClientConfig>){
    this.axios = axios.create({
      ...this.config,
      ...to,
    })
  }

  removeFromQueue(req: RequestQueueItem) {
    const requestId = getRequestId(req, this.config)
    delete this.queue[requestId]
  }

  abort(reqId: string) {
    if (this.queue?.[reqId]?.controller) {
      this.queue[reqId].controller.abort()
    }
  }

  post<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: RequestClientConfig<D>,
  ): CancellablePromise<R> {
    return this.onAxiosRequest<R>('post', [url, data, config])
  }

  get<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    config?: RequestClientConfig<D>,
  ): CancellablePromise<R> {
    return this.onAxiosRequest<R>('get', [url, config])
  }

  patch<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: RequestClientConfig<D>,
  ): CancellablePromise<R> {
    return this.onAxiosRequest<R>('patch', [url, data, config])
  }

  delete<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    config?: AxiosRequestConfig<D>,
  ): CancellablePromise<R> {
    return this.onAxiosRequest<R>('delete', [url, config])
  }

  put<T = any, R = AxiosResponse<T, any>, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): CancellablePromise<R> {
    return this.onAxiosRequest<R>('put', [url, data, config])
  }

  onRequestFailure(err, request, reject) {
    const { failedRequest, shouldReject } = parseFailedRequest(
      err,
      request,
      this.config,
    )

    this.setInQueue(failedRequest)
    console.log('request failed', {request})
    const logName = request?.silent ? 'warn' : 'error'
    this.logger[logName](
      `${request.method.toUpperCase()} to ${request.url} failed with status ${
        err?.response?.status || ''
      }`,
      err?.response?.data || err,
      'Network',
    )

    if (shouldReject) {
      reject({ failedRequest, err })
    }
  }

  onAxiosRequest<T>(method: string, args: any): CancellablePromise<T> {
    const methodId = method.toLowerCase()
    const isRequestMethod = allMethods.includes(methodId)

    if (isRequestMethod) {
      const { request, controller, axiosArgs } = buildRequest(
        methodId,
        args,
        this.config,
      )
      const requestId = getRequestId(request, this.config)

      if (this.queue[requestId]?.requestStatus === 'in_progress') {
        switch (request.duplicateBehavior) {
          case 'cancelPrevious':
            this.abort(requestId)
            break
          case 'maintainPrevious':
            return new Promise<any>((res, rej) => {
              rej({ errorReason: 'ALREADY_IN_PROGRESS' })
            })
        }
      }

      this.setInQueue({
        ...request,
        controller,
        requestStatus: 'in_progress',
      } as RequestQueueItem)

      const promise = new Promise<T>((resolve, reject) => {
        this.axios[method]
          .call(this, ...axiosArgs)
          .then((response) => {
            this.setInQueue({
              ...request,
              requestStatus: 'successful',
            })

            this.logger.log(
              `${method.toUpperCase()} ${
                this.config.baseURL + request.url
              } Successful ${response.status}`,
              response.data,
              'Network',
            )

            resolve(response)
          })
          .catch((err) => this.onRequestFailure(err, { ...request, method }, reject),
          )
      }) as CancellablePromise<T>

      promise.abort = () => {
        this.abort(requestId)
      }

      return promise
    }
  }
}

export function makeFetcher(
  settings: AppSettings,
  override?: Partial<RequestClientConfig>,
) {
  return new RequestClient({
    baseURL: settings.Fetch.ApiURL,
    ...override,
  })
}
