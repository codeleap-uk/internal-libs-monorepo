import { WritableAtom } from 'nanostores'
import { PersistentStore, PersistentEvents, PersistentEvent } from '@nanostores/persistent'

export type StateSelector<S, R> = (state: S) => R

export type GlobalState<T> = Omit<WritableAtom<T>,'set'> & {
  use: <Selected = T>(selector?: StateSelector<T, Selected>) => Selected
  
  set: (newValue: T extends Record<string, any> ? Partial<T> : T) => void
  
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
