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
} from 'react'
import { deepMerge } from './object'
import { AnyFunction, DeepPartial } from '../types'
import { range } from './array'

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
  reorder: ({ from, to }: { from: number; to: number }) => void;
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

export const DOTS = 'dots'

export interface PaginationParams {
  /** Page selected on initial render, defaults to 1 */
  initialPage?: number

  /** Controlled active page number */
  page?: number

  /** Total amount of pages */
  total: number

  /** Siblings amount on left/right side of selected page, defaults to 1 */
  siblings?: number

  /** Amount of elements visible on left/right edges, defaults to 1  */
  boundaries?: number

  /** Callback fired after change of each page */
  onChange?: (page: number) => void
}

export function usePagination({
  total,
  siblings = 1,
  boundaries = 1,
  page,
  initialPage = 1,
  onChange,
}: PaginationParams) {
  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange,
    defaultValue: initialPage,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const setPage = (pageNumber: number) => {
    if (pageNumber <= 0) {
      setActivePage(1)
    } else if (pageNumber > total) {
      setActivePage(total)
    } else {
      setActivePage(pageNumber)
    }
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)

  const paginationRange = useMemo((): (number | 'dots')[] => {
    // Pages count is determined as siblings (left/right) + boundaries(left/right) + currentPage + 2*DOTS
    const totalPageNumbers = siblings * 2 + 3 + boundaries * 2

    /*
     * If the number of pages is less than the page numbers we want to show in our
     * paginationComponent, we return the range [1..total]
     */
    if (totalPageNumbers >= total) {
      return range(1, total)
    }

    const leftSiblingIndex = Math.max(activePage - siblings, boundaries)
    const rightSiblingIndex = Math.min(activePage + siblings, total - boundaries)

    /*
     * We do not want to show dots if there is only one position left
     * after/before the left/right page count as that would lead to a change if our Pagination
     * component size which we do not want
     */
    const shouldShowLeftDots = leftSiblingIndex > boundaries + 2
    const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1)

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = siblings * 2 + boundaries + 2
      return [...range(1, leftItemCount), DOTS, ...range(total - (boundaries - 1), total)]
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = boundaries + 1 + 2 * siblings
      return [...range(1, boundaries), DOTS, ...range(total - rightItemCount, total)]
    }

    return [
      ...range(1, boundaries),
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
      ...range(total - boundaries + 1, total),
    ]
  }, [total, siblings, activePage])

  return {
    range: paginationRange,
    active: activePage,
    setPage,
    next,
    previous,
    first,
    last,
  }
}
