import { useEffect, useMemo, useRef, useState } from 'react'
import { TypeGuards } from '@codeleap/types'
import { AppTheme, Theme, themeStore, Breakpoint } from '@codeleap/styles'
import { getMediaQuery, isMediaQuery } from '../tools'

const getTheme = () => themeStore.getState().current as AppTheme<Theme>

function validateBreakpoint(currentTheme: AppTheme<Theme>, breakpoint: string) {
  const matchesDown = isMediaQuery(currentTheme.media.down(breakpoint as never))
  const matchesUp = isMediaQuery(currentTheme.media.up(breakpoint as never))

  return !matchesUp && matchesDown
}

function useBreakpointMatches() {
  return useState<Record<string, boolean>>(() => {
    const currentTheme = getTheme()

    const breakpointMatches: Record<string, boolean> = {}

    for (const breakpoint in currentTheme.breakpoints) {
      breakpointMatches[breakpoint] = validateBreakpoint(currentTheme, breakpoint)
    }

    return breakpointMatches
  })
}

function useBreakpointListeners() {
  const [breakpointMatches, setBreakpointMatches] = useBreakpointMatches()
  const loaded = useRef(false)
  const mediaQueries = useRef<Record<string, MediaQueryList>>({})

  function callback(event: MediaQueryListEvent, breakpoint: string) {
    const currentTheme = getTheme()

    setBreakpointMatches((prevState) => {
      const updatedMatches = { ...prevState }

      updatedMatches[breakpoint] = validateBreakpoint(currentTheme, breakpoint)

      return updatedMatches
    })
  }

  useEffect(() => {
    if (loaded.current) return

    loaded.current = true

    const currentTheme = getTheme()

    for (const breakpoint in currentTheme.breakpoints) {
      const queryUp = getMediaQuery(currentTheme.media.up(breakpoint as never))

      const matchUp = window.matchMedia(queryUp)

      mediaQueries.current[breakpoint] = matchUp

      try {
        matchUp.addEventListener('change', (event) => callback(event, breakpoint))
      } catch {
        matchUp.addListener((event) => callback(event, breakpoint))
      }
    }

    return () => {
      for (const breakpoint in mediaQueries.current) {
        const matchUp = mediaQueries.current[breakpoint]

        try {
          matchUp.removeEventListener('change', (event) => callback(event, breakpoint))
        } catch {
          matchUp.removeListener((event) => callback(event, breakpoint))
        }
      }

      mediaQueries.current = {}
    }
  }, [])

  return breakpointMatches
}

export function useBreakpointMatch<T = string>(values: Partial<Record<Breakpoint, T>>): T {
  const breakpointMatches = useBreakpointListeners()

  const breakpoints = useMemo(() => {
    return Object.entries(getTheme().breakpoints)
      .sort(([, a], [, b]) => a - b)
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {} as Record<string, number>)
  }, [])

  const breakpointValues = useMemo(() => {
    return Object.keys(breakpoints).sort((a, b) => breakpoints?.[a] - breakpoints?.[b])
  }, [])

  const currentBreakpoint = useMemo(() => {
    return Object.keys(breakpointMatches).find((key) => breakpointMatches[key])
  }, [breakpointMatches])

  const breakpoint = useMemo(() => {
    const validBreakpointIndex = breakpointValues?.findIndex(key => key === currentBreakpoint)

    const validBreakpoints = breakpointValues?.slice(validBreakpointIndex, 100)

    let validBreakpoint = null

    validBreakpoint = validBreakpoints?.find((currentValue) => {
      if (Object?.keys(values)?.includes(currentValue)) {
        return currentValue
      }
    })

    if (TypeGuards.isNil(validBreakpoint)) {
      validBreakpoint = breakpointValues?.reverse()?.find(key => !!values?.[key])
    }

    return validBreakpoint
  }, [currentBreakpoint])

  const value = useMemo(() => values?.[breakpoint], [breakpoint])

  return value
}
