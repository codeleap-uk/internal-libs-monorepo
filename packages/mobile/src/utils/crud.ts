import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { AnyFunction, TypeGuards, UseListEffect } from '@codeleap/common'

type useQueryListRefresh = (
  listQuery: Parameters<UseListEffect>[0],
  options?: {
    staleTime?: number
    initialStale?: boolean
    cancelQueryEnabled?: boolean
    refreshQueryEnabled?: boolean
    onFocus?: AnyFunction
    onBlur?: AnyFunction
  }
) => void

export const useQueryListRefresh: useQueryListRefresh = (listQuery, options = {}) => {
  const {
    staleTime = 10000,
    initialStale = listQuery?.query?.isStale,
    cancelQueryEnabled = true,
    refreshQueryEnabled = true,
    onFocus,
    onBlur,
  } = options

  const staleRefetch = React.useRef(initialStale)
  const staleTimeout = React.useRef(null)

  useFocusEffect(
    React.useCallback(() => {
      if (staleRefetch.current && refreshQueryEnabled) {
        listQuery?.refreshQuery()
      }

      if (TypeGuards.isFunction(onFocus)) {
        onFocus?.()
      }

      return () => {
        if (cancelQueryEnabled) listQuery?.cancelQuery?.()
        staleRefetch.current = false

        if (staleTimeout.current == null) {
          staleTimeout.current = setTimeout(() => {
            staleRefetch.current = true
            clearTimeout(staleTimeout.current)
            staleTimeout.current = null
          }, staleTime)
        }

        if (TypeGuards.isFunction(onBlur)) {
          onBlur?.()
        }
      }
    }, [staleRefetch.current])
  )
}