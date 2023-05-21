import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ExternalRequestClientConfig, InternalRequestClientConfig, RequestQueueItem } from '.'
import { Logger } from '..'
import { CancellablePromise } from '../..'
import { silentLogger } from '../../constants'
import { IRequestClient, RequestClientConfig } from './types'
import { getRequestId, parseFailedRequest, toMultipart } from './utils'

export class RequestClient implements IRequestClient {
  queue: IRequestClient['queue']

  config: RequestClientConfig

  axios: AxiosInstance

  logger: Logger

  toMultipart: RequestClientConfig['multipartParser']

  constructor({ logger, multipartParser = toMultipart, ...config }:RequestClientConfig) {
    this.config = config
    this.logger = logger || silentLogger

    this.axios = axios.create(config)

    this.applyInterceptors()
    this.queue = {}
    this.toMultipart = multipartParser
  }

  applyInterceptors() {
    this.axios.interceptors.request.use(async (c) => {
      let reqConfig = c as InternalRequestClientConfig

      if (reqConfig.multipart && this.config.automaticMultipartParsing) {
        reqConfig.data = await this.toMultipart(reqConfig.data)

        reqConfig.headers.set('Content-Type', 'multipart/form-data') 
      }

      if (this.config.requestMiddleware) {
        for (const middleware of this.config.requestMiddleware) {
          reqConfig = (await middleware(reqConfig)) || reqConfig
        }
      }

      return reqConfig
    })

  }

  setInQueue(req: RequestQueueItem) {
    const requestId = getRequestId(req, this.config)
    this.queue[requestId] = { ...this.queue[requestId], ...req }
  }

  setConfig(to:Partial<RequestClientConfig>) {
    this.config = {
      ...this.config,
      ...to,
    }

    this.axios = axios.create(this.config)
    
    this.applyInterceptors()
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

  onRequestFailure(err, request, reject) {
    const { failedRequest, shouldReject } = parseFailedRequest(
      err,
      request,
      this.config,
    )

    this.setInQueue(failedRequest)
    const logName = request?.silent ? 'warn' : 'error' // NOTE some individual requests should not throw an error
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

  private onRequest<T = any>(data: ExternalRequestClientConfig<T>):CancellablePromise<AxiosResponse<T>> {

    const requestId = `${data.baseURL || this.config?.baseURL || ''}${data.url}`

    if (this.queue[requestId]?.requestStatus === 'in_progress') {
      switch (data.duplicateBehavior) {
        case 'cancelPrevious':
          this.abort(requestId)
          break
        case 'maintainPrevious':
          return new Promise<any>((res, rej) => {
            rej({ errorReason: 'ALREADY_IN_PROGRESS' })
          })
      }
    }
    const controller = new AbortController()

    this.setInQueue({
      ...data,
      controller,
      requestStatus: 'in_progress',
    } as RequestQueueItem)

    const promise = new Promise((resolve, reject) => {
      this.axios({
        ...this.config,
        signal: controller.signal,
        ...data,
      }).then((response) => {
        this.setInQueue({
          ...data,
          controller,
          requestStatus: 'successful',
        })

        this.logger.log(
          `${data.method.toUpperCase()} ${
            this.config.baseURL + data.url
          } Successful ${response.status}`,
          response.data,
          'Network',
        )

        resolve(response)
      }).catch((err) => {
        if (data.debug) {
          console.log(err?.request)
        }
        if (this.config.onError) {
          this.config.onError(err)
        }
        this.onRequestFailure(err, { ...data }, reject)
      })
    }) as CancellablePromise<any>

    promise.abort = () => {
      this.abort(requestId)
    }

    return promise
  }

  patch<T = any>(url:string, data: any, config?: ExternalRequestClientConfig) {
    return this.onRequest<T>({
      url,
      data,
      method: 'PATCH',
      ...config,
    })
  }

  put<T = any>(url:string, data: any, config?: ExternalRequestClientConfig) {
    return this.onRequest<T>({
      url,
      data,
      method: 'PUT',
      ...config,
    })
  }

  get<T = any>(url:string, config?: ExternalRequestClientConfig) {
    return this.onRequest<T>({
      url,
      method: 'GET',
      ...config,
    })
  }

  delete<T = any>(url:string, config?: ExternalRequestClientConfig) {
    return this.onRequest<T>({
      url,
      method: 'DELETE',
      ...config,
    })
  }

  post<T = any>(url:string, data: any, config?: ExternalRequestClientConfig) {
    return this.onRequest<T>({
      url,
      data,
      method: 'POST',
      ...config,
    })
  }

  branch(branchConfig?: RequestClientConfig) {
    const config:RequestClientConfig = {
      ...this.config,
      ...branchConfig,
      multipartParser: this.toMultipart,
      logger: this.logger,
    }

    if (!!branchConfig?.baseURL) {
      config.baseURL = this.config.baseURL + branchConfig.baseURL
    }

    return new RequestClient(config)
  }

}
