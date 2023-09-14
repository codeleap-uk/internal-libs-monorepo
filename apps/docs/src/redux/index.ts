import { createRedux } from '@codeleap/common'
import { appStatusSlice } from './AppStatus'
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const {
  store,
  actions: { AppStatus },
} = createRedux({
  AppStatus: appStatusSlice,
}, {})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export * from './AppStatus'
