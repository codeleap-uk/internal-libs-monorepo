import React from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { AnyFunction, TypeGuards } from '@codeleap/types'
import { QueryManagerOptions } from '@codeleap/query'

type useQueryListRefresh = (
  listQuery: Parameters<QueryManagerOptions<any, any>['useListEffect']>[0],
  options?: {
    staleTime?: number
    initialStale?: boolean
    refreshQueryEnabled?: boolean
    onFocus?: AnyFunction
    onBlur?: AnyFunction
  }
) => void

export const useQueryListRefresh: useQueryListRefresh = (listQuery, options = {}) => {
  const {
    staleTime = 5000,
    initialStale = listQuery?.isStale,
    refreshQueryEnabled = true,
    onFocus,
    onBlur,
  } = options

  const staleRefetch = React.useRef(initialStale)
  const staleTimeout = React.useRef(null)

  useFocusEffect(
    React.useCallback(() => {
      if (staleRefetch.current && refreshQueryEnabled) {
        listQuery?.refetch()
      }

      if (TypeGuards.isFunction(onFocus)) {
        onFocus?.()
      }

      return () => {
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
    }, [])
  )
}
