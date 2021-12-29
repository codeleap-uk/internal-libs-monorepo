import { AxiosRequestConfig, AxiosResponse } from 'axios'

export type FetchFailure = 'NO_RESPONSE' | 'SETUP_ERROR'| 'INVALID_STATUS_CODE' | 'REQUEST_ABORTED' | 'ALREADY_IN_PROGRESS'


export type RequestQueueItem = AxiosRequestConfig & {
    requestStatus: 'failed' | 'successful' | 'in_progress'
    errorReason?: FetchFailure
    controller:AbortController
}

export interface IRequestClient {
    queue: Record<string, RequestQueueItem>
    setInQueue(req:RequestQueueItem):void
}


type MultipartConfig = {
    keyTransforms?: Record<string, 'file'|'json'>
}

export type Middleware<T> = (current:T) => T|void

export type RequestClientConfig<D =any> = AxiosRequestConfig<D> & {
    rejectOnCancel?:boolean
    duplicateBehavior?:'cancelPrevious'|'maintainPrevious'
    multipart?:MultipartConfig|boolean
    requestMiddleware?: Middleware<RequestClientConfig>[]
    responseMiddleware?: Middleware<AxiosResponse>[]
}

export type CancellablePromise<T> = Promise<T> & {abort?:() => void}
