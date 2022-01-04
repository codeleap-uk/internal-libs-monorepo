import { FunctionType, DeepPartial } from '../../types/utility'
import { deepMerge } from '../../utils'
import { combineReducers, createStore, Store } from '@reduxjs/toolkit'

type Reducers<S> = Record<string, FunctionType<[S, any], DeepPartial<S>>>

type AsyncReducers<S> = Record<
    string, 
    FunctionType<
        [
            S, 
            FunctionType<[DeepPartial<S>], void>,
            any
        ], 
        Promise<
            DeepPartial<S> | void
        >
    >
>

type CreateSliceArgs<S, N extends string, R extends  Reducers<S>, AR extends AsyncReducers<S>> = {
    name: N
    initialState: S
    reducers: R
    asyncReducers?: AR
}

type BuildActions<S, R extends  Reducers<S>, AR  extends AsyncReducers<S>> = (store:Store<any>) => {
    [Property in keyof R] : (args: Parameters<R[Property]>[1]) => void
} & {
    [Property in keyof AR] : (args: Parameters<AR[Property]>[2]) => void
}

type Slice<S, N extends string, R extends  Reducers<S>, AR extends AsyncReducers<S>> = {
    buildActions: BuildActions<S, R, AR>
}


export function createSlice<S, 
    N extends string, 
    R extends  Reducers<S>, 
    AR extends AsyncReducers<S>
>({ initialState, name, reducers, asyncReducers}:CreateSliceArgs<S, N, R, AR>):Slice<S, N, R, AR>{
  const reducerCases = []
  
  for (const actionName of Object.keys({...reducers, ...asyncReducers})){
    const nameInReducer = `${name}/${actionName}`
    reducerCases.push(nameInReducer) 
  }
   
  const buildActions = (store:Store) => {
    const actions = {} as Slice<S, N, R, AR>['buildActions']
       
    for (const [actionName, action] of Object.entries(reducers)){
      const nameInReducer = `${name}/${actionName}`
      actions[actionName] = (args) => {
        store.dispatch({type: nameInReducer, payload: action(store.getState()[name], args)})
      }
    }

    for (const [actionName, action] of Object.entries(asyncReducers)){
      const nameInReducer = `${name}/${actionName}`

      const setState = (payload) => store.dispatch({type: nameInReducer, payload})

      actions[actionName] = async (args) => {
        const currentState = store.getState()[name]
        const actionResult = await action(currentState, setState, args)
        if (actionResult){
          store.dispatch({type: nameInReducer, payload: actionResult })
        }
      }
    }
    return actions
  }
    
  return {
    buildActions,
    reducer: (state = initialState, action) => {
      
      if (reducerCases.includes(action.type)){
        
        return deepMerge(state, action.payload)
      }
      return state
    }, 
    initialState,
    name,
  } as Slice<S, N, R, AR>
  
}


const s = createSlice({
  name: 'Counter',
  initialState: {
    value: 1,
    loading: false,
  },
  reducers: {
    increment: (state, a:number) => ( {
      value: state.value+1,
    }),
  },
  asyncReducers: {
    getSomething: async (state, setState, amount:number) => {
      setState({loading: true})

    },
  },
})

export function createRedux<T extends ReturnType<typeof createSlice>[]>(slices:T){
  const reducers = {} as Record<string, T[number]['reducer']>
  const rootInitialState = {} as Record<string, T[number]['initialState']>
  const actionBuilders = {} as Record<string, T[number]['buildActions']>

  for (const {reducer, initialState, buildActions, name} of slices){

    reducers[name] = reducer
    rootInitialState[name] = initialState
    actionBuilders[name] = buildActions
  }


  const store = createStore(
    combineReducers(reducers),
    rootInitialState,
  )

  const actions = Object.fromEntries(
    // @ts-ignore
    Object.entries(actionBuilders).map(([key, builder]) => ([key, builder(store)])),
  )

  return {
    store,
    actions,
  }
}
