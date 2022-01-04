import { CombinedState, Store } from '@reduxjs/toolkit'
import { DeepPartial, FunctionType } from '../..'

export type Reducers<S> = Record<string, FunctionType<[S, any], DeepPartial<S>>>

export type AsyncReducers<S> = Record<
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
export type AnyRecord = Record<string, unknown>

export type CreateSliceArgs<S extends AnyRecord, N extends string, R extends  Reducers<S>, AR extends AsyncReducers<S>> = {
    name: N
    initialState: S
    reducers: R
    asyncReducers?: AR
}

export type BuildActions<S extends AnyRecord, R extends  Reducers<S>, AR  extends AsyncReducers<S>> = (store:Store<any>) => {
    [Property in keyof R] : (args: Parameters<R[Property]>[1]) => void
} & {
    [Property in keyof AR] : (args: Parameters<AR[Property]>[2]) => void
}

export type Slice<S extends AnyRecord, N extends string, R extends  Reducers<S>, AR extends AsyncReducers<S>> = {
    buildActions: BuildActions<S, R, AR>
    name:N
    initialState:S
    reducer: (state:S, action: {type: string, payload: DeepPartial<S>}) => S
}


export type CreateReduxReturn<T extends Record<string, Slice<any, any, any, any>>> = {
    store: Store<CombinedState<{
      [Property in keyof T] : T[Property]['initialState']
    }>>,
    actions : {
      [Property in keyof T] : ReturnType<T[Property]['buildActions']>
    }
  }
