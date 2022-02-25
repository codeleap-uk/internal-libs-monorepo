/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-restricted-imports */
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useLayoutEffect,
  useDebugValue,
  useReducer,
} from 'react'
import { deepMerge } from './object'
import { AnyFunction, DeepPartial } from '../types'

export { default as useUnmount } from 'react-use/lib/useUnmount'
export {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useLayoutEffect,
  useDebugValue,
  useReducer,
}

export const onMount = (func: AnyFunction) => {
  useEffect(() => {
    return func()
  }, [])
}

export const onUpdate = (func: AnyFunction, listeners = []) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return func()
  }, listeners)
}

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export function useToggle<T extends readonly [any, any], V extends T[0] | T[1]>(
  options: T,
  initial: V,
) {
  const [value, setValue] = useState(initial)

  function toggleOrSetValue(newValue?: V) {
    const v: V = newValue || options[Math.abs(options.indexOf(value) - 1)]

    setValue(v)
  }

  return [value, toggleOrSetValue] as const
}

export function useBooleanToggle(initial: boolean) {
  const [v, setV] = useState(initial)

  function toggleOrSet(value?: boolean) {
    if (typeof value === 'boolean') {
      setV(value)
    } else {
      setV((previous) => !previous)
    }
  }

  return [v, toggleOrSet] as const
}

type SetPartialStateCallback<T> = (value: T) => DeepPartial<T>

export function usePartialState<T = any>(initial: T | (() => T)) {
  type ValueType = T extends AnyFunction ? ReturnType<T> : T

  const [state, setState] = useState(initial)

  function setPartial(
    value: DeepPartial<ValueType> | SetPartialStateCallback<ValueType>,
  ) {
    if (typeof value === 'function') {
      setState((v) => deepMerge(v, value(v as ValueType)))
    } else {
      setState(deepMerge(state, value))
    }
  }

  return [
    state as ValueType,
    setPartial as React.Dispatch<React.SetStateAction<DeepPartial<ValueType>>>,
  ] as const
}

export function useInterval(callback: AnyFunction, interval: number) {
  const intervalRef = useRef(null)
  function clear() {
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }

  function start() {
    intervalRef.current = setInterval(callback, interval)
  }

  return {
    clear,
    start,
    interval: intervalRef.current,
  }
}

export function useDebounce<T extends unknown>(
  value: T,
  debounce: number,
): [T, () => void] {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const timeoutRef = useRef(null)

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, debounce)

    return reset
  }, [value])

  return [debouncedValue, reset]
}

export function useScript(src: string) {
  const [status, setStatus] = useState(src ? 'loading' : 'idle')

  useEffect(
    () => {
      if (!src) {
        setStatus('idle')
        return
      }

      // Fetch existing script element by src
      // It may have been added by another instance of this hook
      let script:HTMLScriptElement = document.querySelector(`script[src="${src}"]`)

      if (!script) {
        // Create script
        script = document.createElement('script')
        script.src = src
        script.async = true
        script.setAttribute('data-status', 'loading')
        // Add script to document body
        document.body.appendChild(script)

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          script?.setAttribute(
            'data-status',
            event.type === 'load' ? 'ready' : 'error',
          )
        }

        script.addEventListener('load', setAttributeFromEvent)
        script.addEventListener('error', setAttributeFromEvent)
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute('data-status'))
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === 'load' ? 'ready' : 'error')
      }

      // Add event listeners
      script.addEventListener('load', setStateFromEvent)
      script.addEventListener('error', setStateFromEvent)

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener('load', setStateFromEvent)
          script.removeEventListener('error', setStateFromEvent)
        }
      }
    },
    [src], // Only re-run effect if script src changes
  )

  return status
}
