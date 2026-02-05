import { WritableAtom } from 'nanostores'
import { PersistentStore, PersistentEvents, PersistentEvent } from '@nanostores/persistent'

export type StateSelector<S, R> = (state: S) => R

export type StateSetterFunction<In, Out = In> = (current: In) => Out
export type StateSetter<TIn, TOut = TIn> = TOut | StateSetterFunction<TIn, TOut>

export type GlobalState<T> = Omit<WritableAtom<T>, 'set' | 'get'> & {
  use: <Selected = T>(selector?: StateSelector<T, Selected>) => Selected

  set: (newValue: T extends Record<string, any> ? StateSetter<T, Partial<T>> : StateSetter<T>) => void

  get: <Selected = T>(selector?: StateSelector<T, Selected>) => Selected extends undefined ? T : Selected

  reset: WritableAtom<T>['set']
} & (
    T extends any[] ? Array<T[number]> : {}
  )

export type GlobalStateConfig = {
  persistKey?: string
}

export type GlobalStatePersistor = PersistentStore

export type GlobalStatePersistorEvents = PersistentEvents

export type GlobalStatePersistorEvent = PersistentEvent
