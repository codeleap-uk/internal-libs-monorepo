/* eslint-disable max-lines */
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
  useId as useReactId,
} from 'react'
import { deepMerge } from './object'
import { AnyFunction, DeepPartial, StylesOf } from '../types'

import { uniqueId } from 'lodash'
import { useUnmount } from 'react-use'
import { getNestedStylesByKey } from './misc'
import { TypeGuards } from '.'
import { useGlobalContext } from '../contexts/GlobalContext'

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
    const v: V = newValue || (value === options[0] ? options[1] : options[0])

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

export function useModal(startsOpen = false) {
  const [visible, toggle] = useBooleanToggle(startsOpen)

  return {
    visible, toggle,
  }
}

type SetPartialStateCallback<T> = (value: T) => DeepPartial<T>

export function usePartialState<T= any>(initial: T | (() => T)) {

  const [state, setState] = useState(initial)

  function setPartial(
    value: DeepPartial<T> | SetPartialStateCallback<T>,
  ) {
    if (typeof value === 'function') {
      setState((v) => deepMerge(v, value(v as T)))
    } else {
      setState(deepMerge(state, value))
    }
  }

  return [
    state as T,
    setPartial,
  ] as const
}

export function useInterval(callback: AnyFunction, interval: number, deps = []) {
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

export function useDebounce<T>(
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

export interface UseListStateHandler<T> {
  setState: React.Dispatch<React.SetStateAction<T[]>>
  append: (...items: T[]) => void
  prepend: (...items: T[]) => void
  insert: (index: number, ...items: T[]) => void
  pop: () => void
  shift: () => void
  apply: (fn: (item: T, index?: number) => T) => void
  applyWhere: (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T
  ) => void
  remove: (...indices: number[]) => void
  reorder: ({ from, to }: { from: number; to: number }) => void
  setItem: (index: number, item: T) => void
  setItemProp: <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) => void
}

export type UseListState<T> = [T[], UseListStateHandler<T>]

export function useListState<T>(initialValue: (T[] | (() => T[])) = []): UseListState<T> {
  const [state, setState] = useState(initialValue)

  const append = (...items: T[]) => setState((current) => [...current, ...items])
  const prepend = (...items: T[]) => setState((current) => [...items, ...current])

  const insert = (index: number, ...items: T[]) => setState((current) => [...current.slice(0, index), ...items, ...current.slice(index)])

  const apply = (fn: (item: T, index?: number) => T) => setState((current) => current.map((item, index) => fn(item, index)))

  const remove = (...indices: number[]) => setState((current) => current.filter((_, index) => !indices.includes(index)))

  const pop = () => setState((current) => {
    const cloned = [...current]
    cloned.pop()
    return cloned
  })

  const shift = () => setState((current) => {
    const cloned = [...current]
    cloned.shift()
    return cloned
  })

  const reorder = ({ from, to }: { from: number; to: number }) => setState((current) => {
    const cloned = [...current]
    const item = current[from]

    cloned.splice(from, 1)
    cloned.splice(to, 0, item)

    return cloned
  })

  const setItem = (index: number, item: T) => setState((current) => {
    const cloned = [...current]
    cloned[index] = item
    return cloned
  })

  const setItemProp = <K extends keyof T, U extends T[K]>(index: number, prop: K, value: U) => setState((current) => {
    const cloned = [...current]
    cloned[index] = { ...cloned[index], [prop]: value }
    return cloned
  })

  const applyWhere = (
    condition: (item: T, index: number) => boolean,
    fn: (item: T, index?: number) => T,
  ) => setState((current) => current.map((item, index) => (condition(item, index) ? fn(item, index) : item)),
  )

  return [
    state,
    {
      setState,
      append,
      prepend,
      insert,
      pop,
      shift,
      apply,
      applyWhere,
      remove,
      reorder,
      setItem,
      setItemProp,
    },
  ]
}

export type UncontrolledMode = 'initial' | 'controlled' | 'uncontrolled'

export interface UncontrolledOptions<T> {
  value: T | null | undefined
  defaultValue: T | null | undefined
  finalValue: T | null
  onChange(value: T | null): void
  onValueUpdate?(value: T | null): void
  rule: (value: T | null | undefined) => boolean
}

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  rule,
  onChange,
  onValueUpdate,
}: UncontrolledOptions<T>): readonly [T | null, (nextValue: T | null) => void, UncontrolledMode] {
  // determine, whether new props indicate controlled state
  const shouldBeControlled = rule(value)

  // initialize state
  const modeRef = useRef<UncontrolledMode>('initial')
  const initialValue = rule(defaultValue) ? defaultValue : finalValue
  const [uncontrolledValue, setUncontrolledValue] = useState(initialValue)

  // compute effective value
  let effectiveValue = shouldBeControlled ? value : uncontrolledValue

  if (!shouldBeControlled && modeRef.current === 'controlled') {
    // We are transitioning from controlled to uncontrolled
    // this transition is special as it happens when clearing out
    // the input using "invalid" value (typically null or undefined).
    //
    // Since the value is invalid, doing nothing would mean just
    // transitioning to uncontrolled state and using whatever value
    // it currently holds which is likely not the behavior
    // user expects, so lets change the state to finalValue.
    //
    // The value will be propagated to internal state by useEffect below.

    effectiveValue = finalValue
  }

  modeRef.current = shouldBeControlled ? 'controlled' : 'uncontrolled'
  const mode = modeRef.current

  const handleChange = (nextValue: T | null) => {
    typeof onChange === 'function' && onChange(nextValue)

    // Controlled input only triggers onChange event and expects
    // the controller to propagate new value back.
    if (mode === 'uncontrolled') {
      setUncontrolledValue(nextValue)
    }
  }

  useEffect(() => {
    if (mode === 'uncontrolled') {
      setUncontrolledValue(effectiveValue)
    }
    typeof onValueUpdate === 'function' && onValueUpdate(effectiveValue)
  }, [mode, effectiveValue])

  return [effectiveValue, handleChange, modeRef.current] as const
}

export function useId(prefix?: string) {
  const _id = useReactId()
  return prefix ? `${prefix}${_id}` : _id
}

export function useForceRender() {
  const [_, forceRender] = useReducer((x) => x + 1, 0)

  return forceRender
}

export function useCounter() {
  return useReducer((x) => x + 1, 0)

}

export function useNestedStylesByKey<T extends string, O extends StylesOf<T> = StylesOf<T>>(match: string, variantStyles: any): O {

  return useMemo(() => {
    return getNestedStylesByKey(match, variantStyles) as O
  }, [])

}

export function useWarning(condition: boolean, ...logArgs: any[]) {
  const logged = useRef(false)
  const { logger } = useGlobalContext()

  if (!logged.current && condition) {
    logged.current = true
    logger?.warn(...logArgs)
  }
}

type UsePromiseOptions<T = any> = {
  onResolve?: (value: T) => void
  onReject?: (err: any) => void
  timeout?: number
  debugName?: string
}

export const usePromise = <T = any>(options?: UsePromiseOptions<T>) => {
  const rejectRef = useRef<AnyFunction>()
  const resolveRef = useRef<(v:T) => any>()
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

// useLayoutEffect will show warning if used during ssr, e.g. with Next.js
// useIsomorphicEffect removes it by replacing useLayoutEffect with useEffect during ssr
export const useIsomorphicEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect
