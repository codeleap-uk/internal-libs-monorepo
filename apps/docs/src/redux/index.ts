import { createRedux } from '@codeleap/common'
import { appStatusSlice } from './AppStatus'
import { postsSlice } from './Posts'
import { sessionSlice } from './Session'
import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { Settings } from '@/app'

const ext = [

]

if (typeof window !== 'undefined' && Settings.Environment.IsDev && window.__REDUX_DEVTOOLS_EXTENSION__) {
  ext.push(window.__REDUX_DEVTOOLS_EXTENSION__())
}

export const {
  store,
  actions: { Posts, AppStatus, Session },
} = createRedux({
  Posts: postsSlice,
  AppStatus: appStatusSlice,
  Session: sessionSlice,

}, [], ...ext)

export type RootState = ReturnType<typeof store.getState>
export * from './Posts'
export * from './AppStatus'
export * from './Session'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
