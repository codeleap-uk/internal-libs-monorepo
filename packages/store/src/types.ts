import { WritableAtom } from 'nanostores'
import { PersistentStore, PersistentEvents, PersistentEvent } from '@nanostores/persistent'

export type StateSelector<S, R> = (state: S) => R

export type GlobalState<T> = Omit<WritableAtom<T>, 'set'> & {
  use: <Selected = T>(selector?: StateSelector<T, Selected>) => Selected
  set: (newValue: Partial<T>) => T
}

export type GlobalStateConfig = {
  persistKey?: string
}

export type GlobalStatePersistor = PersistentStore

export type GlobalStatePersistorEvents = PersistentEvents

export type GlobalStatePersistorEvent = PersistentEvent
