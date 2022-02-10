import { usePartialState, capitalize } from '../../utils'
import { useReducer, useRef } from 'react'
import {
  QueryState,
  queryStatuses,
  RoutesOf,
  UseApiArgs,
  UseApiReturn,
  UseApiState,
} from './types'

const getQueryStatusBooleans = (setTo) => Object.fromEntries(
  queryStatuses.map((s) => [`is${capitalize(s)}`, s === setTo]),
)

function initRouteState(routes) {
  const state = {}

  for (const routeName of routes) {
    state[routeName] = {
      ...getQueryStatusBooleans('idle'),
      error: null,
      status: 'idle',
    }
  }

  return state
}

function routesStateReducer(
  state: Record<string, QueryState<Error>>,
  action: { type: string; payload: QueryState<Error> },
) {
  const newRouteState = {
    ...state[action.type],
    ...action.payload,
  }

  return {
    ...state,
    [action.type]: {
      ...newRouteState,
      ...getQueryStatusBooleans(newRouteState.status),
    },
  }
}

export function useQuery<
  T,
  Error = any,
  R extends RoutesOf<T, Error> = RoutesOf<T, Error>,
  RETURN extends UseApiReturn<T, Error, R> = UseApiReturn<T, Error, R>
>(args: UseApiArgs<T, R>): RETURN {
  const { initialState, routes } = args

  const [queryStates, dispatch] = useReducer(
    routesStateReducer,
    Object.keys(routes),
    initRouteState,
  )

  const [apiState, setApiState] = usePartialState<UseApiState<T>>({
    data: initialState,
    loading: false,
    hasError: false,
  })

  function setRouteState(routeName, newState) {
    dispatch({ type: `${routeName}`, payload: newState })

    const newApiState = {
      hasError: false,
      loading: false,
    }

    const queryStateValues = Object.values(queryStates)

    for (const { isError, isLoading } of queryStateValues) {
      if (!newApiState.hasError && isError) {
        newApiState.hasError = true
      }

      if (!newApiState.loading && isLoading) {
        newApiState.loading = true
      }

      if (newApiState.loading && newApiState.hasError) {
        break
      }
    }
  }
  const initialRoutePromises = Object.fromEntries(
    Object.keys(routes).map((name) => [name, null]),
  )
  const promiseRefs = useRef(initialRoutePromises)

  async function callRoute(name, argument) {
    const setThisRoute = (to) => setRouteState(name, to)
    setThisRoute({
      status: 'loading',
    })

    const routeArgs = {
      throwError(e: Error) {
        throw e
      },
      setState(to: T) {
        setApiState({
          data: to,
        })
      },
      currentValue: apiState.data,
    }

    return new Promise((resolve, reject) => {
      promiseRefs.current[name] = routes[name](routeArgs, argument)

      promiseRefs.current[name].then((result) => {
        setThisRoute({
          status: 'success',
        })
        resolve(result)
        promiseRefs.current[name] = null
      })

      promiseRefs.current[name].catch((err) => {
        setThisRoute({
          status: 'error',
          error: err,
        })
        reject(err)
        promiseRefs.current[name] = null
      })
    })
  }

  const routeInterfaces = Object.fromEntries(
    Object.keys(routes).map((name) => {
      const callThisRoute = (argument) => callRoute(name, argument)
      const queryInterface = {
        send: callThisRoute,

        ...queryStates[name],
      }
      return [name, queryInterface]
    }),
  )

  return {
    ...apiState,
    queries: routeInterfaces,
  } as unknown as RETURN
}
