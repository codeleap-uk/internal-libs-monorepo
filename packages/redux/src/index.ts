import { deepMerge } from '@codeleap/utils'
import {
  combineReducers,
  createStore as defaultCreateStore,
  Store,
  applyMiddleware,
  compose,
} from '@reduxjs/toolkit'
import {
  Reducers,
  AsyncReducers,
  CreateSliceArgs,
  Slice,
  CreateReduxReturn,
  CreateReduxOptions,
} from './types'

export function createSlice<
  S extends any,
  N extends string,
  R extends Reducers<S> = Reducers<S>,
  AR extends AsyncReducers<S> = AsyncReducers<S>
>(args: CreateSliceArgs<S, N, R, AR>): Slice<S, N, R, AR> {
  const { initialState, name, reducers, asyncReducers, noMerge } = args
  const reducerCases = []

  for (const actionName of Object.keys({ ...reducers, ...asyncReducers })) {
    const nameInReducer = `${name}/${actionName}`
    reducerCases.push(nameInReducer)
  }

  const buildActions = (store: Store) => {
    const actions = {} as Slice<S, N, R, AR>['buildActions']

    for (const [actionName, action] of Object.entries(reducers)) {
      const nameInReducer = `${name}/${actionName}`
      actions[actionName] = (args) => {
        store.dispatch({
          type: nameInReducer,
          payload: action(store.getState()[name], args),
        })
      }

    }

    for (const [actionName, action] of Object.entries(asyncReducers)) {
      const nameInReducer = `${name}/${actionName}`

      const setState = (payload) => store.dispatch({ type: nameInReducer, payload })

      actions[actionName] = async (args) => {
        const currentState = store.getState()[name]
        const actionResult = await action(currentState, setState, args)

        return actionResult !== undefined ? actionResult : store.getState()[name]
      }
    }
    return actions
  }

  return {
    buildActions,
    reducer: (state = initialState, action) => {

      if (reducerCases.includes(action.type)) {
        const actionName = action.type.split('/')[1]
        if (noMerge?.includes(actionName)) {
          return action.payload
        }

        return deepMerge(state, action.payload)
      }

      return state
    },
    initialState,
    name,
  } as unknown as Slice<S, N, R, AR>
}

export function createRedux<
  T extends Record<string, Slice<any, any, any, any>>
>(slices: T, options: CreateReduxOptions<T>): CreateReduxReturn<T> {

  const { middlewares = [], composeArgs = [], createStore = defaultCreateStore } = options

  const reducers = {} as Record<string, T[string]['reducer']>
  const rootInitialState = {} as { [x: string]: T[string]['initialState'] }
  const actionBuilders = {} as Record<string, T[string]['buildActions']>

  for (const { reducer, initialState, buildActions, name } of Object.values(
    slices,
  )) {
    reducers[name] = reducer
    rootInitialState[name] = initialState
    actionBuilders[name] = buildActions
  }

  // @ts-ignore
  const store = createStore(
    combineReducers(reducers),
    rootInitialState,
    compose(
      applyMiddleware(...middlewares),
      ...composeArgs,
    ),

  ) as CreateReduxReturn<T>['store']

  const actions = Object.fromEntries(
    Object.entries(actionBuilders).map(([key, builder]) => [
      key,
      builder(store),
    ]),
  ) as CreateReduxReturn<T>['actions']

  return {
    store,
    actions,
  }
}
