import React from 'react'
import { AnyFunction } from '@codeleap/types'
import { useEffect } from '@codeleap/hooks'

type UseRefreshOptions = {
    threshold: number
    debounce: number
    enabled: boolean
  }

const scrollDebounce = (func, delay) => {
  const timerRef = React.useRef(null)

  const scrollDebounce = (...args) => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      func(...args)
    }, delay)
  }

  return scrollDebounce
}

export const useRefresh = (onRefresh = () => null, options: UseRefreshOptions) => {

  const {
    threshold,
    debounce,
    enabled,
  } = options

  const [refresh, setRefresh] = React.useState(false)

  const pushToTopRef = React.useRef(0)

  const refresher = React.useCallback(async (_onRefresh: AnyFunction) => {
    setRefresh(true)
    await _onRefresh?.()

    setTimeout(() => {
      setRefresh(false)
      pushToTopRef.current = 0
    }, 2500)
  }, [])

  const containerRef = React.useRef(null)

  const onScroll = scrollDebounce(() => {
    if (containerRef.current) {
      const rect = containerRef.current?.getBoundingClientRect()
      const scrollTop = window?.pageYOffset || document?.documentElement?.scrollTop

      const containerTop = rect.top + scrollTop
      const containerHeight = rect.height

      const distanceFromTop = Math.max(0, scrollTop - containerTop)
      const distanceFromBottom = Math.max(0, containerTop + containerHeight - scrollTop)

      const totalDistance = containerHeight + distanceFromTop + distanceFromBottom
      const percentage = (distanceFromTop / totalDistance) * 100

      if (percentage < threshold) {
        if (pushToTopRef.current === 2) {
          refresher(onRefresh)
        }

        pushToTopRef.current = pushToTopRef.current + 1
      }
    }
  }, debounce)

  useEffect(() => {
    if (enabled) {
      window.addEventListener('scroll', onScroll)

      return () => {
        window.removeEventListener('scroll', onScroll)
      }
    }
  }, [enabled])

  return {
    refresh,
    scrollableRef: containerRef,
    refresher,
  }
}

