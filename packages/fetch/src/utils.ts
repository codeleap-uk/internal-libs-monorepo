import axios from 'axios'
import { methodsWithData } from './constants'
import { FetchFailure, RequestClientConfig, RequestQueueItem } from './types'

const separators = /[\\\/]+/

export function parseFilePathData(path: string) {
  const parts = path.split(separators)

  const lastPart = parts[parts.length - 1]

  let fileName = lastPart
  let ext = ''

  if (lastPart.includes('.')) {
    const dotIdx = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, dotIdx)

    ext = lastPart.substring(dotIdx + 1)
  }

  return {
    path: parts.slice(0, -1).join('/'),
    extension: ext,
    name: fileName,
  }
}


export function buildRequest(methodId, args, instanceConfig) {
  let reqConfig = methodsWithData.includes(methodId) ? args?.[2] : args?.[1]
  reqConfig = {
    ...instanceConfig,
    ...reqConfig,
  }

  const controller = new AbortController()
  reqConfig.signal = controller.signal

  const request = {
    url: args?.[0],
    ...reqConfig,
  }

  if (methodsWithData.includes(methodId)) {
    request.data = args[1]
  }
  const axiosArgs = [request.url, request.data || reqConfig, reqConfig]

  return { request, controller, axiosArgs }
}

export function getRequestId(
  req: RequestQueueItem,
  config: RequestClientConfig,
) {
  return `${req.baseURL || config?.baseURL || ''}${req.url}`
}

export function parseFailedRequest(err, request, instanceConfig) {
  let errorReason: FetchFailure = null

  let shouldReject = true

  if (err instanceof axios.Cancel) {
    errorReason = 'REQUEST_ABORTED'
    shouldReject = instanceConfig.rejectOnCancel
  } else if (err.response) {
    errorReason = 'INVALID_STATUS_CODE'
  } else if (err.request) {
    errorReason = 'NO_RESPONSE'
  } else {
    errorReason = 'SETUP_ERROR'
  }
  const failedRequest: RequestQueueItem = {
    ...request,
    requestStatus: 'failed',
    errorReason,
  }

  return {
    failedRequest,
    shouldReject,
  }
}

const multipartDefaults: Exclude<RequestClientConfig['multipart'], boolean> = {
  keyTransforms: {
    data: 'json',
    image: 'image',
    file: 'image',
    files: 'image',
  },
}

export function toMultipart(request: RequestClientConfig) {
  const options =
    typeof request.multipart === 'boolean' ? {} : request.multipart
  const multipartConfig = {
    ...multipartDefaults,
    ...options,
  }

  const form = new FormData()

  for (const [key, rawValue] of Object.entries(request.data)) {
    let value: string | Partial<Blob & { uri: string; name: string }> =
      rawValue as string

    switch (multipartConfig.keyTransforms[key]) {
      case 'json':
        value = JSON.stringify({
          ...(rawValue as object),
          type: 'application/json',
        })
        break
      case 'image':
        if (typeof rawValue === 'string') {
          value = {
            uri: rawValue,
            name: `image_${rawValue}`,
            type: `image/${parseFilePathData(rawValue).extension}`,
          }
        } else if (rawValue instanceof File) {
          value = rawValue
        } else {

          value = null
        }
        break
      default:
        break
    }

    form.append(key, value as Blob)
  }
  return form
}
