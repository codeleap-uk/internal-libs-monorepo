import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { RequestQueueItem } from '.'
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

    constructor({ logger, ...config }:RequestClientConfig) {
      this.config = config
      this.logger = logger || silentLogger

      this.axios = axios.create(config)

      this.applyInterceptors()
      this.queue = {}
    }

    applyInterceptors() {
      this.axios.interceptors.request.use(async (c) => {
        let reqConfig = c as RequestClientConfig

        if (reqConfig.multipart && this.config.automaticMultipartParsing) {
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
    }

    setInQueue(req: RequestQueueItem) {
      const requestId = getRequestId(req, this.config)
      this.queue[requestId] = { ...this.queue[requestId], ...req }
    }

    setConfig(to:Partial<RequestClientConfig>) {
      this.axios = axios.create({
        ...this.config,
        ...to,
      })

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

    private onRequest<T = any>(data: RequestClientConfig<T>):CancellablePromise<AxiosResponse<T>> {

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
          this.onRequestFailure(err, { ...data }, reject)
        })
      }) as CancellablePromise<any>

      promise.abort = () => {
        this.abort(requestId)
      }

      return promise
    }

    patch<T = any>(url:string, data: any, config?: RequestClientConfig) {
      return this.onRequest<T>({
        url,
        data,
        method: 'PATCH',
        ...config,
      })
    }

    put<T = any>(url:string, data: any, config?: RequestClientConfig) {
      return this.onRequest<T>({
        url,
        data,
        method: 'PUT',
        ...config,
      })
    }

    get<T = any>(url:string, config?: RequestClientConfig) {
      return this.onRequest<T>({
        url,
        method: 'GET',
        ...config,
      })
    }

    delete<T = any>(url:string, config?: RequestClientConfig) {
      return this.onRequest<T>({
        url,
        method: 'DELETE',
        ...config,
      })
    }

    post<T = any>(url:string, data: any, config?: RequestClientConfig) {
      return this.onRequest<T>({
        url,
        data,
        method: 'POST',
        ...config,
      })
    }

}
