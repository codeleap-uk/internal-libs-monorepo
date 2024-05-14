import { AnyFunction, onMount, onUpdate, range, TypeGuards, useUncontrolled } from '@codeleap/common'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { easeInOut, EasingFunction, AnimationProps, useAnimate, useAnimation, animate } from 'framer-motion'
import { globalHistory } from '@reach/router'
import { getNestedStylesByKey } from '@codeleap/common'

export function useWindowSize() {
  const [size, setSize] = useState([])

  onMount(() => {
    setSize([window.innerWidth, window.innerHeight])
  })

  function handleResize() {
    setSize([window.innerWidth, window.innerHeight])
  }

  onUpdate(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}

// type UseClickOutsideOpts = {
//   customId?: string
//   deps?: any[]
// }
// export function useClickOutside(
//   callback: AnyFunction,
//   deps?: UseClickOutsideOpts,
// ) {
//   const id = useRef(deps?.customId || v4())

//   const onClick = useCallback((e: Event) => {
//     const element = document.getElementById(id.current)
//     if (!element) return
//     const isInside = element.contains(e.target as Node) || ((e.target as HTMLElement).id === id.current)

//     // const iterNodes = (el:HTMLElement|Element) => {
//     //   if (isInside) return
//     //   for (let i = 0; i < el.children.length; i++) {
//     //     const node = el.children.item(i)

//     //     if (!node) return
//     //     const _isInside = node.contains(e.target as Node)
//     //     if (_isInside) {
//     //       isInside = _isInside
//     //     }
//     //     if (isInside) break

//     //     if (node.hasChildNodes()) {
//     //       iterNodes(node)
//     //     }

//     //     if (isInside) break
//     //   }
//     // }

//     // if (!isInside) {
//     //   iterNodes(element)
//     // }

//     if (!isInside) {
//       callback(e)
//     }
//   }, deps?.deps || [])
//   onUpdate(() => {

//     document.addEventListener('click', onClick)
//     return () => {
//       document.removeEventListener('click', onClick)
//     }
//   }, [onClick])

//   return id.current
// }

import { useEffect } from 'react'

const DEFAULT_EVENTS = ['mousedown', 'touchstart']

export function useClickOutside<T extends HTMLElement = any>(
  handler: () => void,
  events?: string[] | null,
  nodes?: HTMLElement[],
) {
  const ref = useRef<T>()

  useEffect(() => {
    const listener = (event: any) => {
      if (Array.isArray(nodes)) {
        const shouldIgnore = event?.target?.hasAttribute('data-ignore-outside-clicks')
        const shouldTrigger = nodes.every((node) => !!node && !node.contains(event.target))
        shouldTrigger && !shouldIgnore && handler()
      } else if (ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    };

    (events || DEFAULT_EVENTS).forEach((fn) => document.addEventListener(fn, listener))

    return () => {
      (events || DEFAULT_EVENTS).forEach((fn) => document.removeEventListener(fn, listener))
    }
  }, [ref, handler, nodes])

  return ref
}

export function useScrollEffect(
  effect: (passed: boolean, current: number) => any,
  breakpoint: number,
  extraDependencies = [],
) {
  function handleScroll() {
    const passed = window.scrollY > breakpoint
    effect(passed, window.scrollY)
  }

  onUpdate(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [breakpoint, ...extraDependencies])
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

export interface UseMediaQueryOptions {
  getInitialValueInEffect?: boolean
  initialValue?: boolean
}

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void

/**
 * Older versions of Safari (shipped withCatalina and before) do not support addEventListener on matchMedia
 * https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
export function attachMediaListener(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener('change', callback)
    return () => query.removeEventListener('change', callback)
  } catch (e) {
    query.addListener(callback)
    return () => query.removeListener(callback)
  }
}

function getInitialValue(query: string, initialValue?: boolean) {
  if (typeof initialValue === 'boolean') {
    return initialValue
  }

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(query).matches
  }

  return false
}

export function isMediaQuery(query: string, initialValue = false) {
  const media = query.trim().replace('@media screen and ', '')

  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    return window.matchMedia(media).matches
  }

  return initialValue
}

export function useMediaQuery(
  query: string,
  queryOptions: UseMediaQueryOptions = {},
) {
  const {
    initialValue = false,
    getInitialValueInEffect = true,
  } = queryOptions

  const _query = useMemo(() => {
    return query.trim().replace('@media screen and ', '')
  }, [query])

  const [matches, setMatches] = useState(
    getInitialValueInEffect ? initialValue : isMediaQuery(query, initialValue),
  )

  const queryRef = useRef<MediaQueryList>()

  useEffect(() => {
    if (query.trim() === '') return

    if ('matchMedia' in window) {
      queryRef.current = window.matchMedia(_query)
      setMatches(queryRef.current.matches)
      return attachMediaListener(queryRef.current, (event) => setMatches(event.matches))
    }

    return undefined
  }, [_query])

  return matches
}

type SelectProperties<T extends Record<string|number|symbol, any>, K extends keyof T> = {
  [P in K] : T[K]
}

export function useStaticAnimationStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(obj: T, keys: K[]) {
  const styles = useRef({})

  if (Object.keys(styles.current).length === 0) {
    const mappedStyles = keys.map((k) => [k, { ...obj[k] }])

    styles.current = Object.fromEntries(mappedStyles)
  }

  return styles.current as SelectProperties<T, K>
}

type UseAnimatedVariantStylesConfig<T extends Record<string|number|symbol, any>, K extends keyof T > = {
  variantStyles: T
  animatedProperties: K[]
  updater: (states: SelectProperties<T, K>) => AnimationProps
  dependencies?: any[]
}

export function useAnimatedVariantStyles<T extends Record<string|number|symbol, any>, K extends keyof T >(config: UseAnimatedVariantStylesConfig<T, K>) {
  const { animatedProperties, updater, variantStyles, dependencies = [] } = config

  const staticStyles = useStaticAnimationStyles(variantStyles, animatedProperties)

  const initialState = updater(staticStyles)

  const [animated, setAnimated] = useState(initialState)

  onUpdate(() => {
    const nextState = updater(staticStyles)

    setAnimated(nextState)
  }, dependencies)

  return animated
}

type UseWindowFocusOptions = {
  onFocus?: AnyFunction
  onBlur?: AnyFunction
}

export const useWindowFocus = (options: UseWindowFocusOptions = {}, deps: Array<any> = []): boolean => {
  const [focused, setFocused] = useState(true)

  const onFocus = () => {
    setFocused(true)
    if (TypeGuards.isFunction(options?.onFocus)) options?.onFocus()
  }

  const onBlur = () => {
    setFocused(false)
    if (TypeGuards.isFunction(options?.onBlur)) options?.onBlur()
  }

  useEffect(() => {
    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  }, deps)

  return focused
}

export const usePageExitBlocker = (
  handler: (willLeavePage: boolean) => void,
  deps: Array<any> = [],
  message = 'Are you sure you want to leave?',
) => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!event) return null

    event?.preventDefault()
    event.returnValue = ''
    return
  }

  React.useEffect(() => {
    if (!window) return null

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, deps)

  React.useEffect(() => {
    return globalHistory.listen((args) => {
      if (!window) return null

      const historyPathname = args?.location?.pathname
      const windowPathname = window?.location?.pathname

      const isPopAction = args?.action === 'POP'
      const isLeaveAction = args?.action === 'PUSH' && !historyPathname?.includes(windowPathname)

      if (isLeaveAction || isPopAction) {
        const willLeavePage = window.confirm(message)

        handler?.(willLeavePage)
      }
    })
  }, deps)
}

