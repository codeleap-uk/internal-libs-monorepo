import { useRef } from 'react'
import { TypeGuards, AnyFunction } from '@codeleap/types'

type UsePromiseOptions<T = any> = {
  onResolve?: (value: T) => void
  onReject?: (err: any) => void
  timeout?: number
  debugName?: string
}

export const usePromise = <T = any>(options?: UsePromiseOptions<T>) => {
  const rejectRef = useRef<AnyFunction>(null)
  const resolveRef = useRef<(v:T) => any>(null)
  const timeoutRef = useRef(null)
  const reject = async (err: any) => {
    await rejectRef.current?.(err)
    options?.onReject?.(err)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    rejectRef.current = null
  }

  const resolve = async (value: T) => {
    await resolveRef.current?.(value)
    options?.onResolve?.(value)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    resolveRef.current = null
  }

  const _await = () => {
    return new Promise<T>((resolve, reject) => {
      rejectRef.current = reject
      resolveRef.current = resolve
      if (TypeGuards.isNumber(options?.timeout) && options?.timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          reject(new Error(`usePromise: ${options?.debugName || ''} timed out after ${options?.timeout}ms`))
        }, options?.timeout)
      }
    })
  }

  return {
    _await,
    resolve,
    reject,
  }
}
